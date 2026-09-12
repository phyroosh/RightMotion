from bs4 import BeautifulSoup
import sys

with open("public/index.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

cmd_modal = soup.find(id="commandPaletteModal")
if cmd_modal:
    new_html = """
<div id="commandPaletteModal" class="hidden fixed inset-0 z-[200] bg-black/60 cmd-palette-bg flex items-start justify-center pt-[15vh]">
   <div class="w-full max-w-2xl bg-[#0a0f18]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md flex flex-col">
      <div class="p-4 flex items-center gap-3 border-b border-white/10">
         <i data-lucide="search" class="w-5 h-5 text-slate-400"></i>
         <input type="text" id="cmdInput" class="w-full bg-transparent border-none text-xl text-slate-100 placeholder-slate-500 focus:outline-none" placeholder="Search commands, open Metadata, Publish..." />
      </div>
      <div id="cmdResults" class="p-2 flex flex-col gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
         <button onclick="document.getElementById('metadataDrawer').classList.remove('hidden'); document.getElementById('commandPaletteModal').classList.add('hidden');" class="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-slate-200 font-mono text-sm flex items-center justify-between group cursor-pointer transition">
             <span class="flex items-center gap-3"><i data-lucide="layout-panel-right" class="w-4 h-4 text-sky-400"></i> Open Metadata & Release Station</span>
             <span class="text-[10px] text-slate-500 group-hover:text-sky-300">Editor</span>
         </button>
         <button onclick="openPublishModal('both'); document.getElementById('commandPaletteModal').classList.add('hidden');" class="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-slate-200 font-mono text-sm flex items-center justify-between group cursor-pointer transition">
             <span class="flex items-center gap-3"><i data-lucide="rocket" class="w-4 h-4 text-purple-400"></i> Blast to All Channels</span>
             <span class="text-[10px] text-slate-500 group-hover:text-purple-300">Publish</span>
         </button>
         <button onclick="document.getElementById('memeBoardModal').classList.remove('opacity-0', 'pointer-events-none'); document.getElementById('commandPaletteModal').classList.add('hidden');" class="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-slate-200 font-mono text-sm flex items-center justify-between group cursor-pointer transition">
             <span class="flex items-center gap-3"><i data-lucide="smile" class="w-4 h-4 text-amber-400"></i> Open Meme Board</span>
             <span class="text-[10px] text-slate-500 group-hover:text-amber-300">Creative</span>
         </button>
         <button onclick="openSettingsModal(); document.getElementById('commandPaletteModal').classList.add('hidden');" class="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-slate-200 font-mono text-sm flex items-center justify-between group cursor-pointer transition">
             <span class="flex items-center gap-3"><i data-lucide="settings" class="w-4 h-4 text-slate-400"></i> Studio Settings</span>
             <span class="text-[10px] text-slate-500 group-hover:text-slate-300">Config</span>
         </button>
      </div>
      <div class="px-4 py-2 border-t border-white/5 text-[10px] text-slate-500 font-mono flex justify-between">
          <span>Navigate with arrows</span>
          <span>ESC to close</span>
      </div>
   </div>
</div>
"""
    new_cmd = BeautifulSoup(new_html, "html.parser")
    cmd_modal.replace_with(new_cmd)

# Fix drawer close button
drawer = soup.find(id="metadataDrawer")
if drawer:
    btns = drawer.find_all("button")
    if btns and "onclick" in btns[0].attrs and 'document.getElementById(' in btns[0]["onclick"]:
        pass # Need to fix
    
    # Just replace the first button in metadata drawer
    new_btn = BeautifulSoup("<button type='button' onclick=\"document.getElementById('metadataDrawer').classList.add('hidden')\" class='absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 flex items-center justify-center transition cursor-pointer z-50'><i data-lucide='x' class='w-4 h-4'></i></button>", "html.parser")
    if btns:
        btns[0].replace_with(new_btn)


with open("public/index.html", "w", encoding="utf-8") as f:
    f.write(str(soup))
print("Fixed palette and drawer buttons.")
