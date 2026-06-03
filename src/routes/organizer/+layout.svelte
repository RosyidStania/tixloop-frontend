<script>
</script>

<div class="organizer-layout min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-purple-900 text-white p-4">
        <h2 class="text-xl font-bold mb-4">Organizer Portal</h2>
        <nav>
            <ul class="space-y-2">
                <li><a href="/organizer/dashboard" class="block py-2 px-4 hover:bg-purple-800 rounded">Dashboard</a></li>
                <li><a href="/organizer/events" class="block py-2 px-4 hover:bg-purple-800 rounded">Manage Events</a></li>
            </ul>
        </nav>
    </aside>
    <main class="flex-1 p-8">
        <slot />
    </main>
</div>
