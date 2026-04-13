import { useState, useEffect } from 'react';
import { supabase, ADMIN_PASSWORD } from '../lib/supabase';
import { Plus, Trash2, Pencil, X, Upload, LogOut, Save, ImageIcon, Loader2, Check, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  // ─── Auth ───
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // ─── Products ───
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Form ───
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  // ─── Delete confirm ───
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Toast ───
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Tabs ───
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'home'

  // ─── Home Config ───
  const [homeConfig, setHomeConfig] = useState({});
  const [configLoading, setConfigLoading] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState(null); // 'home_editorial_1' | 'home_editorial_2'

  // ─── Session persistence ───
  useEffect(() => {
    const saved = sessionStorage.getItem('sf_admin_auth');
    if (saved === 'true') setIsAuthenticated(true);
  }, []);

  // ─── Load initial data ───
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'catalog') fetchProducts();
      if (activeTab === 'home') fetchHomeConfig();
    }
  }, [isAuthenticated, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Erro ao carregar produtos:', error);
      showToast('Erro ao carregar produtos.', 'error');
    }
    setProducts(data || []);
    setLoading(false);
  };

  const fetchHomeConfig = async () => {
    setConfigLoading(true);
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*');

    if (error) {
      console.error('Erro ao carregar configurações:', error);
      showToast('Erro ao carregar fotos da home.', 'error');
    } else {
      const configMap = {};
      data?.forEach(item => { configMap[item.chave] = item.valor; });
      setHomeConfig(configMap);
    }
    setConfigLoading(false);
  };

  // ─── Update Home Image ───
  const handleUpdateHomeImage = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingTarget(key);
    try {
      const imageUrl = await uploadImage(file);
      
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ chave: key, valor: imageUrl }, { onConflict: 'chave' });

      if (error) throw error;

      setHomeConfig(prev => ({ ...prev, [key]: imageUrl }));
      showToast('Imagem atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar imagem da home:', err);
      showToast('Erro ao atualizar imagem.', 'error');
    }
    setUploadingTarget(null);
  };

  // ─── Auth handlers ───
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sf_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Senha incorreta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sf_admin_auth');
  };

  // ─── Image handling ───
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('produtos')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('produtos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ─── Save (create or update) ───
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = editingProduct?.image_url || '';

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('produtos')
          .update({
            name: formData.name,
            price: formData.price,
            image_url: imageUrl,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        showToast('Produto atualizado com sucesso!');
      } else {
        const maxOrder = products.length > 0
          ? Math.max(...products.map(p => p.sort_order || 0))
          : 0;

        const { error } = await supabase
          .from('produtos')
          .insert({
            name: formData.name,
            price: formData.price,
            image_url: imageUrl,
            sort_order: maxOrder + 1,
          });

        if (error) throw error;
        showToast('Produto adicionado com sucesso!');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      showToast('Erro ao salvar. Tente novamente.', 'error');
    }

    setSaving(false);
  };

  // ─── Delete ───
  const handleDelete = async (id) => {
    setDeleting(true);
    const { error } = await supabase.from('produtos').delete().eq('id', id);

    if (error) {
      showToast('Erro ao excluir produto.', 'error');
    } else {
      showToast('Produto excluído.');
    }

    setDeleteConfirm(null);
    setDeleting(false);
    fetchProducts();
  };

  // ─── Edit ───
  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price });
    setImagePreview(product.image_url);
    setImageFile(null);
    setShowForm(true);
  };

  // ─── Reset ───
  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '' });
    setImageFile(null);
    setImagePreview('');
  };

  // ═══════════════════════════════════════════════
  //  LOGIN VIEW
  // ═══════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1F1B18] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl text-[#F7F3EE] tracking-wider">
              Susana Freitas
            </h1>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/30 mt-4">
              Área Administrativa
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
            placeholder="Digite a senha"
            autoFocus
            className="w-full bg-white/5 border border-white/10 text-[#F7F3EE] px-5 py-4 font-sans text-sm tracking-wide placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />

          {authError && (
            <p className="text-red-400/80 text-xs font-sans mt-3 text-center">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-[#F7F3EE] text-[#1F1B18] py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors font-medium"
          >
            Entrar
          </button>

          <a
            href="/"
            className="block text-center mt-8 font-sans text-xs text-white/20 hover:text-white/40 transition-colors tracking-wider"
          >
            ← Voltar ao site
          </a>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  //  DASHBOARD VIEW
  // ═══════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* ─── Toast ─── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 shadow-lg font-sans text-sm tracking-wide animate-slide-in
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#1F1B18] text-[#F7F3EE]'}`}
        >
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} />}
          {toast.message}
        </div>
      )}

      {/* ─── Header ─── */}
      <header className="bg-[#1F1B18] text-[#F7F3EE] px-6 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-serif text-xl tracking-wider hover:text-white/80 transition-colors">
            Susana Freitas
          </a>
          <div className="hidden sm:flex items-center font-sans text-[10px] tracking-[0.3em] uppercase text-white/30 border-l border-white/10 pl-4 h-4">
            Painel de Controle
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-wider font-sans transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      {/* ─── Tabs Navigation ─── */}
      <nav className="bg-white border-b border-[#EAE1D7]">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-4 font-sans text-[10px] tracking-[0.25em] uppercase transition-colors relative ${
              activeTab === 'catalog' ? 'text-[#1F1B18] font-bold' : 'text-[#7A6051]/50 hover:text-[#7A6051]'
            }`}
          >
            Catálogo de Peças
            {activeTab === 'catalog' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1F1B18]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`py-4 font-sans text-[10px] tracking-[0.25em] uppercase transition-colors relative ${
              activeTab === 'home' ? 'text-[#1F1B18] font-bold' : 'text-[#7A6051]/50 hover:text-[#7A6051]'
            }`}
          >
            Design da Home
            {activeTab === 'home' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1F1B18]" />
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'catalog' ? (
          <>
            {/* ─── Actions Bar ─── */}
            <div className="flex items-center justify-between mb-8">
              <p className="font-sans text-sm text-[#7A6051]">
                {loading ? 'Carregando...' : `${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`}
              </p>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 bg-[#1F1B18] text-[#F7F3EE] px-5 py-3 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#2F2622] transition-colors"
              >
                <Plus size={14} />
                Nova Peça
              </button>
            </div>

      {/* ─── Product Grid ─── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#7A6051]" size={24} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto text-[#7A6051]/30 mb-4" size={48} />
            <p className="font-sans text-[#7A6051] mb-4">Nenhum produto cadastrado ainda.</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="font-sans text-xs uppercase tracking-wider text-[#1F1B18] underline underline-offset-4 hover:no-underline"
            >
              Adicionar primeiro produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-[#EAE1D7] overflow-hidden mb-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-[#7A6051]/20" size={32} />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#1F1B18]/0 group-hover:bg-[#1F1B18]/60 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(product)}
                      className="bg-white text-[#1F1B18] p-3 hover:bg-[#F7F3EE] transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="bg-white text-red-600 p-3 hover:bg-red-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-serif text-sm text-[#1F1B18] leading-snug line-clamp-2">{product.name}</h3>
                <p className="font-sans text-xs text-[#7A6051] mt-1">{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  ADD / EDIT MODAL                              */}
      {/* ═══════════════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] px-4 py-8" onClick={resetForm}>
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE1D7]">
              <h2 className="font-serif text-xl text-[#1F1B18]">
                {editingProduct ? 'Editar Peça' : 'Nova Peça'}
              </h2>
              <button onClick={resetForm} className="text-[#7A6051] hover:text-[#1F1B18] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-[#7A6051] mb-3">
                  Foto do Produto
                </label>
                <label className="block aspect-[3/4] max-h-[280px] bg-[#FAF7F2] border-2 border-dashed border-[#C2AE98]/40 cursor-pointer hover:border-[#7A6051]/50 transition-colors overflow-hidden relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#7A6051]/40">
                      <Upload size={28} className="mb-3" />
                      <span className="font-sans text-xs">Clique para selecionar a foto</span>
                      <span className="font-sans text-[10px] mt-1 text-[#7A6051]/30">JPG, PNG ou WebP</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="mt-2 font-sans text-[10px] text-red-500 uppercase tracking-wider hover:text-red-700"
                  >
                    Remover foto
                  </button>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-[#7A6051] mb-2">
                  Nome da Peça
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Vestido Power Francine"
                  required
                  className="w-full border border-[#C2AE98]/30 px-4 py-3 font-sans text-sm text-[#1F1B18] placeholder:text-[#7A6051]/30 focus:outline-none focus:border-[#7A6051]/50 transition-colors bg-transparent"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-[#7A6051] mb-2">
                  Preço
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(f => ({ ...f, price: e.target.value }))}
                  placeholder="Ex: R$ 579,90"
                  required
                  className="w-full border border-[#C2AE98]/30 px-4 py-3 font-sans text-sm text-[#1F1B18] placeholder:text-[#7A6051]/30 focus:outline-none focus:border-[#7A6051]/50 transition-colors bg-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-[#C2AE98]/30 py-3.5 font-sans text-xs tracking-[0.15em] uppercase text-[#7A6051] hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#1F1B18] text-[#F7F3EE] py-3.5 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[#2F2622] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/*  DELETE CONFIRMATION MODAL                     */}
      {/* ═══════════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] px-6" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white w-full max-w-sm p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="font-serif text-xl text-[#1F1B18] mb-2">Excluir produto?</h3>
            <p className="font-sans text-sm text-[#7A6051] mb-8">Essa ação não pode ser desfeita.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 border border-[#C2AE98]/30 py-3 font-sans text-xs tracking-[0.15em] uppercase text-[#7A6051] hover:bg-[#FAF7F2] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-3 font-sans text-xs tracking-[0.15em] uppercase hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : null}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

          </>
        ) : (
          <div className="space-y-12 pb-16">
            <div className="bg-white border border-[#EAE1D7] p-8">
              <h2 className="font-serif text-2xl text-[#1F1B18] mb-2">Imagens Editoriais (Home)</h2>
              <p className="font-sans text-sm text-[#7A6051] mb-8">
                Altere aqui as fotos que aparecem na seção "Luxo Silencioso" da página inicial.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Posicao 1 */}
                <div className="space-y-4">
                  <span className="block font-sans text-[11px] tracking-[0.15em] uppercase text-[#7A6051]">
                    Foto Principal (Esquerda)
                  </span>
                  <div className="relative aspect-[3/4] bg-[#FAF7F2] border border-[#EAE1D7] overflow-hidden group">
                    <img 
                      src={homeConfig.home_editorial_1 || '/images/catalog/1.png'} 
                      alt="Preview 1" 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="bg-white text-[#1F1B18] px-6 py-3 font-sans text-[10px] tracking-widest uppercase cursor-pointer hover:bg-[#F7F3EE] transition-colors flex items-center gap-2">
                        {uploadingTarget === 'home_editorial_1' ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        {uploadingTarget === 'home_editorial_1' ? 'Subindo...' : 'Trocar Foto'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleUpdateHomeImage(e, 'home_editorial_1')}
                          disabled={!!uploadingTarget}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Posicao 2 */}
                <div className="space-y-4">
                  <span className="block font-sans text-[11px] tracking-[0.15em] uppercase text-[#7A6051]">
                    Foto Secundária (Direita)
                  </span>
                  <div className="relative aspect-[3/4] bg-[#FAF7F2] border border-[#EAE1D7] overflow-hidden group">
                    <img 
                      src={homeConfig.home_editorial_2 || '/images/catalog/3.png'} 
                      alt="Preview 2" 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="bg-white text-[#1F1B18] px-6 py-3 font-sans text-[10px] tracking-widest uppercase cursor-pointer hover:bg-[#F7F3EE] transition-colors flex items-center gap-2">
                        {uploadingTarget === 'home_editorial_2' ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        {uploadingTarget === 'home_editorial_2' ? 'Subindo...' : 'Trocar Foto'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleUpdateHomeImage(e, 'home_editorial_2')}
                          disabled={!!uploadingTarget}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 flex gap-4 items-start">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <div className="font-sans text-sm text-amber-800 leading-relaxed">
                <p className="font-bold mb-1">Dica de Estilo:</p>
                As fotos da home devem transmitir o conceito de "Quiet Luxury". 
                Priorize fotos com cores neutras, luz natural e composição editorial para manter a estética premium da loja.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Inline Styles for Toast Animation ─── */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
