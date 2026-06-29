// ── SUPABASE ──
const SUPABASE_URL = 'https://ldxtoykbcuypjfyerhoo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeHRveWtiY3V5cGpmeWVyaG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDkwMjksImV4cCI6MjA5NzQ4NTAyOX0.tiHApVfW5K3_2Nn3p7HsTj3SqeHwyGsRYlduY4CZbXc';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Error de conexión con Supabase:', error);
    } else {
      console.log('✅ Supabase conectado correctamente');
    }
  } catch (error) {
    console.error('❌ Error de conexión con Supabase:', error);
  }
}

checkSupabaseConnection();

// ── NAV ── Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});
