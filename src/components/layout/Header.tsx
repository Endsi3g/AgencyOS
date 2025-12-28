interface HeaderProps {
    title: string;
    breadcrumb?: string;
}

export default function Header({ title, breadcrumb }: HeaderProps) {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark z-10 sticky top-0">
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="flex flex-col">
                    {breadcrumb && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs mb-0.5">
                            <span>{breadcrumb}</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        </div>
                    )}
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
                </div>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
                {/* Search */}
                <div className="hidden sm:flex items-center max-w-xs w-full mx-4">
                    <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input
                            type="text"
                            className="w-full h-10 pl-10 pr-4 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/* Mobile search */}
                <button className="sm:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    <span className="material-symbols-outlined">search</span>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors relative">
                        <span className="material-symbols-outlined text-[22px]">notifications</span>
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                    </button>

                    <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">help</span>
                    </button>

                    {/* Mobile avatar */}
                    <div
                        className="md:hidden size-8 rounded-full bg-cover bg-center ml-2"
                        style={{
                            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJ82eHF_TptYo9givyUU1es05Ms5SXdItt7DcDVxHauQRen7mTbs7H3IbbGtJXEJzzUKDnWd5N0HYT965StI0BNrsMO5rSSqlicZQndUbiFG_mwz3riVs1L9rGT0jas0oVYHEZGejGRi5Q_mhY3NsBT8wbwnLBDXPBPyHDdY5aioruagK27GEXjai9qlZu7HakZKGp1C00_5Kaai8eHyHTKrgLYc43VNO1_yI57KFHpQpOJeYhKO0h1xQOEJEYm1TKcgJW2_S4IOw")`,
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
