<script>
</script>

<div class="admin-layout min-h-screen bg-gray-100 flex">
    <aside class="w-64 bg-gray-900 text-white p-4">
        <h2 class="text-xl font-bold mb-4">TixLoop Admin</h2>
        <nav>
            <ul class="space-y-2">
                <li><a href="/admin/dashboard" class="block py-2 px-4 hover:bg-gray-800 rounded">Dashboard</a></li>
                <li><a href="/admin/users" class="block py-2 px-4 hover:bg-gray-800 rounded">Users Management</a></li>
            </ul>
        </nav>
    </aside>
    <main class="flex-1 p-8">
        <slot />
    </main>
</div>
