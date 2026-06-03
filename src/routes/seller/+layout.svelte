<script>
</script>

<div class="seller-layout min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-blue-900 text-white p-4">
        <h2 class="text-xl font-bold mb-4">Seller Portal</h2>
        <nav>
            <ul class="space-y-2">
                <li><a href="/seller/dashboard" class="block py-2 px-4 hover:bg-blue-800 rounded">Dashboard</a></li>
                <li><a href="/seller/sales" class="block py-2 px-4 hover:bg-blue-800 rounded">Sales & Reports</a></li>
            </ul>
        </nav>
    </aside>
    <main class="flex-1 p-8">
        <slot />
    </main>
</div>
