const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const target = `<div className="flex items-center gap-3">
                <span className={\`text-xs font-bold \${formData.isComingSoon ? 'text-cyan-500' : 'text-pink-500'}\`}>
                  {formData.isComingSoon ? 'Muy Pronto' : 'Publicada'}
                </span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isComingSoon: !formData.isComingSoon})}
                  className={\`relative inline-flex h-7 w-14 items-center rounded-full transition-colors \${formData.isComingSoon ? 'bg-cyan-500' : 'bg-pink-500'}\`}
                >
                  <span className={\`inline-block h-5 w-5 transform rounded-full bg-white transition-transform \${formData.isComingSoon ? 'translate-x-8' : 'translate-x-1'} shadow-sm\`} />
                </button>
              </div>
            </div>`;

const replacement = `<div className="flex items-center gap-3">
                <span className={\`text-xs font-bold \${formData.isComingSoon ? 'text-cyan-500' : 'text-pink-500'}\`}>
                  {formData.isComingSoon ? 'Muy Pronto' : 'Publicada'}
                </span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isComingSoon: !formData.isComingSoon})}
                  className={\`relative inline-flex h-7 w-14 items-center rounded-full transition-colors \${formData.isComingSoon ? 'bg-cyan-500' : 'bg-pink-500'}\`}
                >
                  <span className={\`inline-block h-5 w-5 transform rounded-full bg-white transition-transform \${formData.isComingSoon ? 'translate-x-8' : 'translate-x-1'} shadow-sm\`} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="font-bold text-sm block text-slate-800">Ocultar serie al público (Borrador)</span>
                <span className="text-xs text-slate-500">Solo visible para el administrador</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={\`text-xs font-bold \${formData.isHidden ? 'text-slate-500' : 'text-pink-500'}\`}>
                  {formData.isHidden ? 'Oculta' : 'Visible'}
                </span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isHidden: !formData.isHidden})}
                  className={\`relative inline-flex h-7 w-14 items-center rounded-full transition-colors \${formData.isHidden ? 'bg-slate-400' : 'bg-pink-500'}\`}
                >
                  <span className={\`inline-block h-5 w-5 transform rounded-full bg-white transition-transform \${formData.isHidden ? 'translate-x-8' : 'translate-x-1'} shadow-sm\`} />
                </button>
              </div>
            </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
