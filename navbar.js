document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = "https://eyzvqdknrkkjznqvmxgb.supabase.co";
  const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5enZxZGtucmtranpucXZteGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0OTc1NzksImV4cCI6MjA1NDA3MzU3OX0.v-3bKrF431br9SKSXPzUOHU-f4CW_4SAgtSic502sbs";

  const { createClient } = window.supabase;
  if (!createClient) {
    console.error("Supabase library failed to load.");
    return;
  }

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  // DOM Elements
  const authButtons = document.getElementById('auth-buttons');
  const loggedInStatus = document.getElementById('logged-in-status');
  const userInfo = document.getElementById('user-info');

  // Check User Session
  async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
      // User is logged in
      authButtons.classList.add('hidden');
      loggedInStatus.classList.remove('hidden');

      // Fetch user details
      const { data: userData } = await supabaseClient.auth.getUser();
      const user = userData.user;

      const avatar = loggedInStatus.querySelector('img');
      const userName = user.user_metadata.name || 'User';
      const userRole = user.user_metadata.role || 'user';

      if (user.user_metadata.avatar_url) {
        avatar.src = user.user_metadata.avatar_url;
      }
      userInfo.textContent = `Logged In as ${userName} (${userRole})`;
    } else {
      // User is not logged in
      authButtons.classList.remove('hidden');
      loggedInStatus.classList.add('hidden');
    }
  }

  // Initialize Navbar
  checkSession();

  // Listen for Auth State Changes
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      checkSession();
    } else if (event === 'SIGNED_OUT') {
      checkSession();
    }
  });
});