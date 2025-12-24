
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Files, 
  Cpu, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  HardDrive, 
  Settings, 
  Search, 
  Database, 
  Eye, 
  X, 
  FileText, 
  Calendar, 
  ShieldAlert,
  FolderOpen,
  RefreshCw,
  Save,
  Monitor,
  ToggleRight,
  Printer,
  Link,
  ShieldCheck,
  Server,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SystemStatus, ProcessingLog, FileEntry, DocumentData } from './types';
import { analyzeDocumentText } from './services/geminiService';

// Helper Components
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl metronic-shadow border-0 flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      {icon}
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-[#181C32]">{value}</p>
    </div>
  </div>
);

const LogItem: React.FC<{ log: ProcessingLog }> = ({ log }) => {
  const levelColors = {
    info: 'border-blue-500 text-blue-700 bg-blue-50',
    success: 'border-green-500 text-green-700 bg-green-50',
    warning: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    error: 'border-red-500 text-red-700 bg-red-50'
  };

  return (
    <div className={`p-3 mb-2 border-r-4 rounded-l shadow-sm flex items-center justify-between animate-in slide-in-from-right duration-300 ${levelColors[log.level]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono opacity-60">{log.timestamp}</span>
        <span className="text-sm font-medium">{log.message}</span>
      </div>
      {log.fileName && <span className="text-xs font-bold px-2 py-1 bg-white bg-opacity-50 rounded uppercase">{log.fileName}</span>}
    </div>
  );
};

export default function App() {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'schema' | 'config'>('dashboard');
  const [processedCount, setProcessedCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  
  // Settings States
  const [scannerId, setScannerId] = useState('EPSON-DS-780N-HQ');
  const [inputPath, setInputPath] = useState('C:/ArchiveSystem/Daily_Scans');
  const [outputPath, setOutputPath] = useState('C:/ArchiveSystem/Processed_Files');
  const [backupPath, setBackupPath] = useState('D:/Archive_Backup/Cloud_Sync');
  const [autoStart, setAutoStart] = useState(true);
  const [isRefreshingScanners, setIsRefreshingScanners] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const [pendingFiles, setPendingFiles] = useState<FileEntry[]>([
    { id: '1', name: 'قرار_تعيين_102.jpg', path: 'Daily_Scans/HR/قرار_تعيين_102.jpg', status: 'pending' },
    { id: '2', name: 'خطاب_شكر_005.png', path: 'Daily_Scans/Public/خطاب_شكر_005.png', status: 'pending' },
    { id: '3', name: 'محضر_اجتماع_12.jpg', path: 'Daily_Scans/Admin/محضر_اجتماع_12.jpg', status: 'pending' },
  ]);

  const addLog = useCallback((message: string, level: ProcessingLog['level'] = 'info', fileName?: string) => {
    const newLog: ProcessingLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      message,
      level,
      fileName
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const triggerManualScan = async () => {
    if (status !== SystemStatus.IDLE) return;
    setStatus(SystemStatus.SCANNING);
    addLog('بدء المسح اليدوي العميق للمجلدات (Recursive Scanning)...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    const randomSuffix = Math.floor(Math.random() * 1000);
    const discoveredFile: FileEntry = {
      id: Date.now().toString(),
      name: `وارد_جديد_${randomSuffix}.pdf`,
      path: `${inputPath}/Automated/وارد_جديد_${randomSuffix}.pdf`,
      status: 'pending'
    };
    setPendingFiles(prev => [...prev, discoveredFile]);
    addLog(`اكتمل المسح. تم العثور على ملفات جديدة وتحديث قائمة الانتظار.`, 'success');
    setStatus(SystemStatus.IDLE);
  };

  const startAutomatedProcess = async () => {
    if (status !== SystemStatus.IDLE) return;
    setStatus(SystemStatus.SCANNING);
    addLog('بدء الأتمتة الشاملة للملفات المجدولة...', 'info');

    for (const file of pendingFiles) {
      if (file.status === 'done') continue;

      setStatus(SystemStatus.OCR_LOCAL);
      addLog('قراءة الوثيقة عبر Chandra OCR (Level 1)...', 'info', file.name);
      await new Promise(r => setTimeout(r, 1200));

      setStatus(SystemStatus.AI_ANALYSIS);
      addLog('تحليل المنطق عبر Gemini AI (Level 2)...', 'info', file.name);
      
      const simulatedRawText = `المملكة العربية السعودية، وزارة الطاقة. إدارة العقود. تعميم رقم 778 بتاريخ 1445/05/10. الموضوع: ضوابط صرف المستحقات. درجة السرية: سري.`;
      const extractedData = await analyzeDocumentText(simulatedRawText);

      if (extractedData) {
        setStatus(SystemStatus.RPA_ENTRY);
        addLog('تنفيذ RPA وإدخال البيانات آلياً (Level 3)...', 'warning', file.name);
        await new Promise(r => setTimeout(r, 1500));
        
        setProcessedCount(prev => prev + 1);
        setPendingFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'done', data: extractedData } : f));
        addLog('اكتملت أرشفة الملف بنجاح ونقل للأرشيف النهائي.', 'success', file.name);
      }
    }

    setStatus(SystemStatus.IDLE);
    addLog('اكتملت جميع العمليات بنجاح.', 'success');
  };

  const refreshScanners = async () => {
    setIsRefreshingScanners(true);
    addLog('البحث عن أجهزة الماسح الضوئي المرتبطة بالشبكة والمنفذ المباشر...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    setIsRefreshingScanners(false);
    addLog('تم تحديث قائمة الأجهزة المتوفرة (3 أجهزة تم العثور عليها).', 'success');
  };

  const testScannerConnection = async () => {
    setIsTestingConnection(true);
    addLog(`اختبار الاتصال بـ ${scannerId}...`, 'info');
    await new Promise(r => setTimeout(r, 2000));
    setIsTestingConnection(false);
    addLog('تم تأكيد الاتصال بنجاح. الجهاز في وضع الاستعداد.', 'success');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#1E1E2D] text-gray-300 flex flex-col fixed h-full z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-[#3E97FF] p-2 rounded-lg text-white">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight uppercase">Chandra-Bot</span>
        </div>

        <nav className="flex-1 px-4 mt-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${activeTab === 'dashboard' ? 'bg-[#2B2B40] text-white shadow-md' : 'hover:bg-[#2B2B40] hover:text-white'}`}>
            <LayoutDashboard size={20} /> <span className="font-semibold">لوحة التحكم</span>
          </button>
          <button onClick={() => setActiveTab('queue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${activeTab === 'queue' ? 'bg-[#2B2B40] text-white shadow-md' : 'hover:bg-[#2B2B40] hover:text-white'}`}>
            <Files size={20} /> <span className="font-semibold">طابور الملفات</span>
          </button>
          <button onClick={() => setActiveTab('schema')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${activeTab === 'schema' ? 'bg-[#2B2B40] text-white shadow-md' : 'hover:bg-[#2B2B40] hover:text-white'}`}>
            <Database size={20} /> <span className="font-semibold">قاموس البيانات</span>
          </button>
          <div className="my-6 border-t border-gray-700 mx-4"></div>
          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${activeTab === 'config' ? 'bg-[#2B2B40] text-white shadow-md' : 'hover:bg-[#2B2B40] hover:text-white'}`}>
            <Settings size={20} /> <span className="font-semibold">الإعدادات الفنية</span>
          </button>
        </nav>

        <div className="p-6 bg-[#1B1B28] m-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">النظام</span>
            <div className={`w-3 h-3 rounded-full ${status === SystemStatus.IDLE ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-blue-500 animate-pulse'}`}></div>
          </div>
          <p className="text-sm font-bold text-white mb-2">{status === SystemStatus.IDLE ? 'متصل وجاهز' : 'قيد العمل'}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-[280px] p-8 relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[#181C32]">نظام الأرشفة الذكي</h1>
            <p className="text-gray-400 font-medium">
              {activeTab === 'config' ? 'تجهيز أجهزة المسح وتكوين مسارات الإدخال' : 'إدارة العمليات المؤتمتة وتحليل البيانات'}
            </p>
          </div>
          {activeTab !== 'config' && (
            <div className="flex items-center gap-4">
              <button onClick={triggerManualScan} disabled={status !== SystemStatus.IDLE} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-50 text-[#3E97FF] hover:bg-blue-100 disabled:opacity-50 transition-all">
                <Search size={18} /> مسح المجلدات
              </button>
              <button onClick={startAutomatedProcess} disabled={status !== SystemStatus.IDLE} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#3E97FF] text-white hover:bg-[#2884ef] disabled:opacity-50 shadow-lg shadow-blue-200 transition-all">
                <Zap size={18} fill="currentColor" /> تشغيل الأتمتة
              </button>
            </div>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="إجمالي الأرشفة" value={processedCount} icon={<CheckCircle size={28} />} color="bg-green-500" />
                <StatCard title="في الانتظار" value={pendingFiles.filter(f => f.status === 'pending').length} icon={<Clock size={28} />} color="bg-blue-500" />
              </div>
              <div className="bg-white rounded-xl metronic-shadow p-6">
                <h2 className="text-xl font-bold text-[#181C32] mb-6">سجل العمليات المباشر</h2>
                <div className="h-[400px] overflow-y-auto pr-2">
                  {logs.length === 0 ? <p className="text-center text-gray-400 mt-20 italic font-medium">لا توجد عمليات نشطة حالياً...</p> : logs.map(log => <LogItem key={log.id} log={log} />)}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-xl metronic-shadow p-6">
                <h2 className="text-lg font-bold text-[#181C32] mb-4">كفاءة الأداء</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1 font-bold text-[#3F4254]"><span className="text-gray-500">دقة OCR (Chandra)</span><span>98.4%</span></div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-500 h-full rounded-full" style={{width: '98%'}}></div></div>
                  <div className="flex justify-between text-sm mt-4 mb-1 font-bold text-[#3F4254]"><span className="text-gray-500">تحليل AI (Gemini)</span><span>95.2%</span></div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full" style={{width: '95%'}}></div></div>
                </div>
              </div>
              <div className="bg-white rounded-xl metronic-shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#181C32]">الجهاز المتصل</h2>
                  <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_green]"></span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all">
                  <div className="p-3 bg-white text-[#3E97FF] rounded-lg shadow-sm group-hover:bg-[#3E97FF] group-hover:text-white transition-all"><Printer size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-[#181C32] leading-none mb-1">{scannerId}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">TWAIN Network Client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="bg-white rounded-xl metronic-shadow p-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-[#181C32] mb-6">طابور الملفات المستخرجة</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="pb-4">اسم الملف</th>
                    <th className="pb-4">الحالة</th>
                    <th className="pb-4">النوع</th>
                    <th className="pb-4">الموضوع</th>
                    <th className="pb-4">التاريخ</th>
                    <th className="pb-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingFiles.map(file => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 font-bold text-[#3F4254] text-sm">{file.name}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${file.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {file.status === 'done' ? 'مكتمل' : 'قيد الانتظار'}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600 font-medium">{file.data?.docType || '---'}</td>
                      <td className="py-4 text-sm text-gray-600 font-bold truncate max-w-[200px]">
                        {file.data?.subject || '---'}
                      </td>
                      <td className="py-4 text-sm text-gray-500 font-medium">{file.data?.date || '---'}</td>
                      <td className="py-4 text-center">
                        <button 
                          onClick={() => setSelectedFile(file)}
                          className={`p-2 rounded-lg transition-all ${file.status === 'done' ? 'text-[#3E97FF] hover:bg-blue-50 shadow-sm border border-transparent hover:border-blue-100' : 'text-gray-200 cursor-not-allowed'}`}
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 max-w-5xl mx-auto pb-20">
            {/* Section 1: Scanner Linking */}
            <div className="bg-white rounded-xl metronic-shadow overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#fcfcfc]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3E97FF] bg-opacity-10 text-[#3E97FF] rounded-xl shadow-sm">
                    <Printer size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#181C32]">ربط أجهزة الماسح الضوئي (Scanner Setup)</h2>
                    <p className="text-gray-400 text-sm font-medium">تحديد الجهاز النشط لجمع الوثائق الرقمية</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={refreshScanners}
                    disabled={isRefreshingScanners}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 hover:text-[#3E97FF] font-bold rounded-xl border border-gray-200 transition-all hover:bg-white"
                  >
                    <RefreshCw size={18} className={isRefreshingScanners ? 'animate-spin' : ''} />
                    تحديث القائمة
                  </button>
                  <button 
                    onClick={testScannerConnection}
                    disabled={isTestingConnection}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-[#3E97FF] font-bold rounded-xl border border-blue-100 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    <Link size={18} className={isTestingConnection ? 'animate-pulse' : ''} />
                    اختبار الاتصال
                  </button>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3F4254]">المعرف الخاص بالماسح النشط (Scanner ID)</label>
                    <div className="relative">
                      <select 
                        value={scannerId} 
                        onChange={(e) => setScannerId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#3E97FF] focus:bg-white transition-all font-bold text-[#181C32] appearance-none"
                      >
                        <option value="EPSON-DS-780N-HQ">Epson DS-780N (High Speed Direct)</option>
                        <option value="HP-SCANJET-PRO-4500">HP ScanJet Pro 4500 f1</option>
                        <option value="FUJITSU-FI-7160">Fujitsu fi-7160 Production</option>
                        <option value="LOCAL-SCANNER-SDR">Virtual Local Scanner (Test Mode)</option>
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronRight className="rotate-90" size={18} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-[#3F4254]">بروتوكول الاتصال المفضل</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 px-4 bg-[#3E97FF] text-white font-bold rounded-xl border border-[#3E97FF] shadow-sm">TWAIN v2.0</button>
                      <button className="py-3 px-4 bg-white border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all">WIA Standard</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 flex flex-col justify-center">
                  <h4 className="font-bold text-[#181C32] flex items-center gap-2 mb-3">
                    <ShieldCheck size={18} className="text-green-500" />
                    المعايرة والتحسين (Auto-Correction)
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-500 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> تعديل اتجاه الصفحة آلياً (Auto-Rotation).</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> تنظيف الضجيج البصري (De-speckle) قبل الـ OCR.</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> الكشف التلقائي عن الصفحات الفارغة.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Folder Management */}
            <div className="bg-white rounded-xl metronic-shadow">
              <div className="p-8 border-b border-gray-100 flex items-center gap-4 bg-[#fcfcfc]">
                <div className="p-3 bg-green-500 bg-opacity-10 text-green-600 rounded-xl shadow-sm">
                  <FolderOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#181C32]">مسارات العمل (Workflow Paths)</h2>
                  <p className="text-gray-400 text-sm font-medium">تحديد نقاط تجميع الوثائق الممسوحة والأرشيف النهائي</p>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input Path */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#3F4254] flex items-center gap-2">
                      مجلد تجميع المسح (Daily Scans Collection)
                      <AlertCircle size={14} className="text-blue-400" />
                    </label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={inputPath}
                        onChange={(e) => setInputPath(e.target.value)}
                        placeholder="C:/Path/To/Scans"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pl-12 outline-none focus:ring-2 focus:ring-[#3E97FF] focus:bg-white transition-all font-mono text-[11px] font-bold text-[#3F4254]"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E97FF]">
                        <Search size={20} />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">البوت يراقب هذا المسار باستمرار (Recursive Mode).</p>
                  </div>

                  {/* Output Path */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#3F4254]">مجلد الأرشفة النهائي (Processed Output)</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={outputPath}
                        onChange={(e) => setOutputPath(e.target.value)}
                        placeholder="C:/Path/To/Archive"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pl-12 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-mono text-[11px] font-bold text-[#3F4254]"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#3F4254] flex items-center gap-2">
                    مجلد النسخ الاحتياطي (Cloud Sync / Backup)
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded uppercase">إضافي</span>
                  </label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={backupPath}
                      onChange={(e) => setBackupPath(e.target.value)}
                      placeholder="D:/Backup/Remote"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pl-12 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-mono text-[11px] font-bold text-[#3F4254]"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500">
                      <Server size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Advanced Options */}
            <div className="bg-white rounded-xl metronic-shadow">
              <div className="p-8 border-b border-gray-100 flex items-center gap-4 bg-[#fcfcfc]">
                <div className="p-3 bg-purple-500 bg-opacity-10 text-purple-600 rounded-xl shadow-sm">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#181C32]">تخصيص سلوك البوت (AI Behavior)</h2>
                  <p className="text-gray-400 text-sm font-medium">إعدادات الأتمتة المتقدمة والاستجابة</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#3E97FF] transition-all group">
                  <div>
                    <h4 className="font-bold text-[#181C32] mb-1">المعالجة الفورية (Real-time Trigger)</h4>
                    <p className="text-xs text-gray-400 font-medium">بدء الأتمتة فور اكتشاف ملف جديد في المجلد المحدد</p>
                  </div>
                  <button onClick={() => setAutoStart(!autoStart)} className={`transition-all transform active:scale-95 ${autoStart ? 'text-[#3E97FF]' : 'text-gray-300'}`}>
                    <ToggleRight size={44} fill={autoStart ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="p-5 border border-gray-100 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all">
                    <input type="checkbox" className="w-5 h-5 accent-[#3E97FF] rounded-md" defaultChecked />
                    <div>
                      <h5 className="text-sm font-bold text-[#181C32]">إغلاق نافذة الأرشفة بعد الحفظ</h5>
                      <p className="text-[10px] text-gray-400 font-bold">محاكاة RPA للانتقال للملف التالي</p>
                    </div>
                  </label>
                  <label className="p-5 border border-gray-100 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all">
                    <input type="checkbox" className="w-5 h-5 accent-[#3E97FF] rounded-md" defaultChecked />
                    <div>
                      <h5 className="text-sm font-bold text-[#181C32]">توليد تقرير PDF ملخص يومي</h5>
                      <p className="text-[10px] text-gray-400 font-bold">إحصائيات الملفات المؤرشفة بنجاح</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="p-8 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
                <button className="px-8 py-3 font-bold text-gray-400 hover:text-[#181C32] transition-colors rounded-xl">تجاهل</button>
                <button className="flex items-center gap-2 px-12 py-3 bg-[#3E97FF] text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-[#2884ef] transition-all transform active:scale-95">
                  <Save size={20} />
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected File Details Modal (Enhanced) */}
        {selectedFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E1E2D] bg-opacity-70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#fcfcfc]">
                <div>
                  <h3 className="text-xl font-bold text-[#181C32]">تحليل الوثيقة الهجين (Hybrid AI Result)</h3>
                  <p className="text-xs text-gray-400 mt-1 font-bold">المستند المصدري: {selectedFile.name}</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 group hover:bg-[#3E97FF] transition-all cursor-default">
                    <div className="flex items-center gap-3 mb-1">
                      <FileText size={18} className="text-blue-600 group-hover:text-white" />
                      <p className="text-[10px] text-blue-500 group-hover:text-blue-100 font-bold uppercase tracking-wider">نوع الوثيقة</p>
                    </div>
                    <p className="font-bold text-[#181C32] group-hover:text-white text-lg">{selectedFile.data?.docType}</p>
                  </div>
                  <div className="p-5 bg-green-50 rounded-2xl border border-green-100 group hover:bg-green-600 transition-all cursor-default">
                    <div className="flex items-center gap-3 mb-1">
                      <Calendar size={18} className="text-green-600 group-hover:text-white" />
                      <p className="text-[10px] text-green-500 group-hover:text-green-100 font-bold uppercase tracking-wider">تاريخ الوثيقة</p>
                    </div>
                    <p className="font-bold text-[#181C32] group-hover:text-white text-lg">{selectedFile.data?.date}</p>
                  </div>
                  <div className="p-5 bg-red-50 rounded-2xl border border-red-100 group hover:bg-red-600 transition-all cursor-default">
                    <div className="flex items-center gap-3 mb-1">
                      <ShieldAlert size={18} className="text-red-600 group-hover:text-white" />
                      <p className="text-[10px] text-red-500 group-hover:text-red-100 font-bold uppercase tracking-wider">درجة السرية</p>
                    </div>
                    <p className="font-bold text-[#181C32] group-hover:text-white text-lg">{selectedFile.data?.securityLevel}</p>
                  </div>
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 group hover:bg-purple-600 transition-all cursor-default">
                    <div className="flex items-center gap-3 mb-1">
                      <Database size={18} className="text-purple-600 group-hover:text-white" />
                      <p className="text-[10px] text-purple-500 group-hover:text-purple-100 font-bold uppercase tracking-wider">رقم القيد</p>
                    </div>
                    <p className="font-bold text-[#181C32] group-hover:text-white text-lg">{selectedFile.data?.entryNumber}</p>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">خلاصة الموضوع (Subject Summary)</p>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold">Chandra AI v2.5</span>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-[#3F4254] font-bold leading-relaxed text-xl shadow-inner border-r-4 border-r-[#3E97FF]">
                    {selectedFile.data?.subject}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button onClick={() => setSelectedFile(null)} className="px-12 py-3 bg-[#181C32] text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg">تم الاطلاع</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="bg-white rounded-xl metronic-shadow p-10 max-w-4xl mx-auto animate-in fade-in duration-500 mt-4">
            <div className="flex items-center gap-5 mb-10 border-b border-gray-100 pb-8">
              <div className="p-5 bg-[#3E97FF] bg-opacity-10 text-[#3E97FF] rounded-2xl shadow-sm">
                <Database size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-[#181C32]">قاموس البيانات الموحد</h2>
                <p className="text-gray-400 font-bold">المعايير المعتمدة لاستخراج وتحليل البيانات (المركز الوطني للوثائق)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#3E97FF] transition-all bg-white hover:shadow-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-[#3E97FF] opacity-20 group-hover:opacity-100 transition-all"></div>
                <h3 className="font-extrabold text-[#181C32] mb-4 text-lg flex items-center gap-2">
                  <CheckCircle size={20} className="text-blue-500" />
                  Subject (الموضوع)
                </h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed mb-4">تحليل محتوى الوثيقة بالكامل واستخلاص ملخص دقيق يعبر عن الجوهر الإداري للخطاب أو القرار.</p>
                <div className="text-[11px] font-extrabold text-[#3E97FF] uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-md">المصدر: متن الخطاب + الترويسة</div>
              </div>

              <div className="p-8 border border-gray-100 rounded-2xl hover:border-green-400 transition-all bg-white hover:shadow-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-green-500 opacity-20 group-hover:opacity-100 transition-all"></div>
                <h3 className="font-extrabold text-[#181C32] mb-4 text-lg flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" />
                  IDs & Names (الأعلام)
                </h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed mb-4">استخراج كافة الهويات الوطنية، السجلات التجارية، والأسماء الواردة في الوثيقة أو الجداول الملحقة.</p>
                <div className="text-[11px] font-extrabold text-green-600 uppercase tracking-widest bg-green-50 inline-block px-3 py-1 rounded-md">المصدر: الجداول + الفقرات</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
