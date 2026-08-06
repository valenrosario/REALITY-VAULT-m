const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const target1 = `const SortableSeriesCard: React.FC<{ series: Series, onClick: () => void }> = ({ series, onClick }) => {`;
const replace1 = `const SortableSeriesCard: React.FC<{ series: Series, onClick: () => void, onToggleHidden: (e: React.MouseEvent) => void }> = ({ series, onClick, onToggleHidden }) => {`;

const target2 = `className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[#00dbef] hover:shadow-[0_0_15px_rgba(0,219,239,0.3)] transition-all hover:-translate-y-1 group relative shadow-sm"
    >`;
const replace2 = `className={\`bg-white/80 backdrop-blur-xl border \${series.isHidden ? 'border-slate-400 opacity-60 grayscale-[0.5]' : 'border-slate-200'} rounded-2xl overflow-hidden cursor-pointer hover:border-[#00dbef] hover:shadow-[0_0_15px_rgba(0,219,239,0.3)] transition-all hover:-translate-y-1 group relative shadow-sm\`}
    >
      <button 
        onClick={onToggleHidden}
        className="absolute top-2 right-2 z-30 bg-white/90 backdrop-blur-md p-1.5 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm"
        title={series.isHidden ? "Mostrar serie" : "Ocultar serie"}
      >
        {series.isHidden ? <EyeOff size={16} className="text-slate-500" /> : <Eye size={16} className="text-slate-700" />}
      </button>`;

code = code.replace(target1, replace1).replace(target2, replace2);

const target3 = `{series.isComingSoon ? 'Muy Pronto' : 'Publicada'}
        </span>`;
const replace3 = `{series.isComingSoon ? 'Muy Pronto' : 'Publicada'}
        </span>
        {series.isHidden && (
          <span className="inline-block text-[9px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 ml-2 bg-slate-200 text-slate-600 border border-slate-300">Oculta</span>
        )}`;

code = code.replace(target3, replace3);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
