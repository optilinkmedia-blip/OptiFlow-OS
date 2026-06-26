#!/bin/bash
FILES="src/components/CeoView.tsx src/components/DistributionView.tsx src/components/SeedsView.tsx src/components/ContentFactoryView.tsx src/components/MonetizationView.tsx src/App.tsx src/index.css"

for file in $FILES; do
  if [ -f "$file" ]; then
    sed -i 's/bg-white/bg-[#1f1e24]/g' "$file"
    sed -i 's/text-slate-900/text-white/g' "$file"
    sed -i 's/text-slate-805/text-white\/90/g' "$file"
    sed -i 's/text-slate-800/text-white\/90/g' "$file"
    sed -i 's/text-slate-700/text-white\/80/g' "$file"
    sed -i 's/text-slate-600/text-white\/70/g' "$file"
    sed -i 's/text-slate-550/text-white\/60/g' "$file"
    sed -i 's/text-slate-500/text-white\/50/g' "$file"
    sed -i 's/text-slate-450/text-white\/45/g' "$file"
    sed -i 's/text-slate-405/text-white\/40/g' "$file"
    sed -i 's/text-slate-400/text-white\/40/g' "$file"
    sed -i 's/text-slate-300/text-white\/30/g' "$file"
    sed -i 's/text-slate-205/text-white\/20/g' "$file"
    sed -i 's/text-slate-200/text-white\/20/g' "$file"
    sed -i 's/text-slate-150/text-white\/15/g' "$file"
    sed -i 's/text-slate-100/text-white\/10/g' "$file"
    # Borders
    sed -i 's/border-slate-100/border-white\/5/g' "$file"
    sed -i 's/border-slate-150/border-white\/10/g' "$file"
    sed -i 's/border-slate-200\/60/border-white\/10/g' "$file"
    sed -i 's/border-slate-200/border-white\/10/g' "$file"
    sed -i 's/border-slate-205/border-white\/15/g' "$file"
    
    # Bgs
    sed -i 's/bg-slate-50\/40/bg-[#2b2a31]/g' "$file"
    sed -i 's/bg-slate-50\/45/bg-[#2b2a31]/g' "$file"
    sed -i 's/bg-slate-50\/50/bg-[#2b2a31]/g' "$file"
    sed -i 's/bg-slate-50\/80/bg-[#2b2a31]/g' "$file"
    sed -i 's/bg-slate-50/bg-[#2b2a31]/g' "$file"
    sed -i 's/bg-slate-100/bg-[#35343d]/g' "$file"
    sed -i 's/hover:bg-slate-50/hover:bg-[#35343d]/g' "$file"
    sed -i 's/hover:bg-slate-55\/65/hover:bg-[#35343d]/g' "$file"
    sed -i 's/hover:border-slate-200/hover:border-white\/20/g' "$file"
    
    # Indigos -> Emerald equivalents
    sed -i 's/bg-indigo-600/bg-emerald-600/g' "$file"
    sed -i 's/bg-indigo-500/bg-emerald-500/g' "$file"
    sed -i 's/hover:bg-indigo-500/hover:bg-emerald-500/g' "$file"
    sed -i 's/text-indigo-700/text-emerald-400/g' "$file"
    sed -i 's/text-indigo-600/text-emerald-400/g' "$file"
    sed -i 's/text-indigo-500/text-emerald-500/g' "$file"
    sed -i 's/text-indigo-400/text-emerald-300/g' "$file"
    sed -i 's/text-indigo-300/text-emerald-200/g' "$file"
    sed -i 's/bg-indigo-50\/40/bg-emerald-500\/10/g' "$file"
    sed -i 's/bg-indigo-50\/30/bg-emerald-500\/10/g' "$file"
    sed -i 's/bg-indigo-50/bg-emerald-500\/10/g' "$file"
    sed -i 's/border-indigo-500/border-emerald-500/g' "$file"
    sed -i 's/border-indigo-100\/50/border-emerald-500\/20/g' "$file"
    sed -i 's/border-indigo-100\/60/border-emerald-500\/20/g' "$file"
    sed -i 's/border-indigo-100/border-emerald-500\/20/g' "$file"
    sed -i 's/hover:border-indigo-100/hover:border-emerald-500\/30/g' "$file"
    
    # Specific colors
    sed -i 's/bg-rose-50\/40/bg-rose-500\/10/g' "$file"
    sed -i 's/bg-rose-50/bg-rose-500\/10/g' "$file"
    sed -i 's/bg-rose-55/bg-rose-500\/10/g' "$file"
    sed -i 's/border-rose-100/border-rose-500\/20/g' "$file"
    sed -i 's/border-rose-200/border-rose-500\/30/g' "$file"
    sed -i 's/text-rose-700/text-rose-400/g' "$file"
    sed -i 's/text-rose-600/text-rose-400/g' "$file"
    
    sed -i 's/bg-emerald-50\/40/bg-emerald-500\/10/g' "$file"
    sed -i 's/bg-emerald-50/bg-emerald-500\/10/g' "$file"
    sed -i 's/border-emerald-100/border-emerald-500\/20/g' "$file"
    sed -i 's/text-emerald-700/text-emerald-400/g' "$file"
    sed -i 's/text-emerald-600/text-emerald-400/g' "$file"
    sed -i 's/text-emerald-605/text-emerald-400/g' "$file"
    
    sed -i 's/bg-amber-50\/40/bg-amber-500\/10/g' "$file"
    sed -i 's/bg-amber-50/bg-amber-500\/10/g' "$file"
    sed -i 's/bg-amber-55/bg-amber-500\/10/g' "$file"
    sed -i 's/bg-amber-100/bg-amber-500\/20/g' "$file"
    sed -i 's/border-amber-100/border-amber-500\/20/g' "$file"
    sed -i 's/text-amber-800/text-amber-400/g' "$file"
    sed -i 's/text-amber-700/text-amber-400/g' "$file"
    sed -i 's/text-amber-600/text-amber-400/g' "$file"

    sed -i 's/bg-sky-50\/40/bg-sky-500\/10/g' "$file"
    sed -i 's/bg-sky-50/bg-sky-500\/10/g' "$file"
    sed -i 's/border-sky-100/border-sky-500\/20/g' "$file"
    sed -i 's/text-sky-700/text-sky-400/g' "$file"
    sed -i 's/text-sky-600/text-sky-400/g' "$file"

    sed -i 's/bg-teal-55/bg-teal-500\/10/g' "$file"
    sed -i 's/text-teal-700/text-teal-400/g' "$file"

    sed -i 's/bg-indigo-55/bg-emerald-500\/10/g' "$file"

    sed -i 's/border-slate-50/border-white\/5/g' "$file"
    
    sed -i 's/bg-slate-5//bg-[rgba(255,255,255,0.03)]/g' "$file"
  fi
done
