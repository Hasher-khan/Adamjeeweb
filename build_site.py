import os
import re

source_base = r"d:\Adamjeeproject\stitch_adamjee_coaching_digital_experience\stitch_adamjee_coaching_digital_experience"
target_base = r"d:\Adamjeeproject\AdamjeeWebsite"

if not os.path.exists(target_base):
    os.makedirs(target_base)

pages = {
    "adamjee_coaching_home_desktop": "index.html",
    "admissions_adamjee_coaching": "admissions.html",
    "our_faculty_adamjee_coaching": "faculty.html",
    "timetable_adamjee_coaching": "timetable.html"
}

def process_html(content, current_page):
    # Replace inline tailwind config with external script
    # It starts with <script id="tailwind-config"> and ends with </script>
    content = re.sub(r'<script id="tailwind-config">.*?</script>', '<script src="tailwind-config.js"></script>', content, flags=re.DOTALL)
    
    # Update navigation links
    content = content.replace('href="#"', 'href="javascript:void(0)"') # reset all # links to empty or void
    
    # We will manually replace the text in links if they match the navigation
    # This is a bit brittle, but let's try a simple replacement for the known nav structure
    # Since each file has a slightly different nav, let's just do a naive replacement
    content = content.replace('>Home<', ' href="index.html">Home<')
    content = content.replace('>Admissions<', ' href="admissions.html">Admissions<')
    content = content.replace('>Faculty<', ' href="faculty.html">Faculty<')
    content = content.replace('>Programs<', ' href="timetable.html">Programs<')
    content = content.replace('>Results<', ' onclick="showComingSoonModal(event)" href="javascript:void(0)">Results<')
    content = content.replace('href="javascript:void(0)" href="', 'href="')
    content = content.replace('href="javascript:void(0)" onclick=', 'onclick=')

    modal_html = """
    <div id="comingSoonModal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
        <div class="bg-surface p-xl rounded-xl shadow-2xl text-center max-w-md w-full mx-4 border border-outline-variant/30">
            <span class="material-symbols-outlined text-secondary text-[48px] mb-md" style="font-variation-settings: 'FILL' 1;">campaign</span>
            <h2 class="text-headline-md font-headline-md text-primary mb-sm">Coming Soon</h2>
            <p class="text-body-md font-body-md text-on-surface-variant mb-lg">The results portal is currently under development. Please check back later!</p>
            <button onclick="hideComingSoonModal()" class="bg-primary text-on-primary px-lg py-sm rounded-lg hover:bg-primary-container transition-colors font-label-md w-full">Got it</button>
        </div>
    </div>
    <script>
        function showComingSoonModal(e) {
            if(e) e.preventDefault();
            const modal = document.getElementById('comingSoonModal');
            if(modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        }
        function hideComingSoonModal() {
            const modal = document.getElementById('comingSoonModal');
            if(modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }
    </script>
    </body>
    """
    content = content.replace('</body>', modal_html)

    return content

for folder, out_name in pages.items():
    src_path = os.path.join(source_base, folder, "code.html")
    if os.path.exists(src_path):
        with open(src_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        content = process_html(content, out_name)
        
        with open(os.path.join(target_base, out_name), "w", encoding="utf-8") as f:
            f.write(content)
            
print("Site built successfully.")
