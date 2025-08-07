export async function POST(request) {
    const body = await request.json();
    const { nama, email, pesan } = body;

    if (!nama || !email || !pesan) {
        return new Response(JSON.stringify({ message: "Data tidak lengkap" }), {
            status: 400,
        });
    }

    // Simpan ke Redis hanya saat runtime
    try {
        const Redis = (await import("../../lib/redis")).default;

        const timestamp = Date.now();
        const key = `pesan:${timestamp}`;
        const value = JSON.stringify({ nama, email, pesan });

        await Redis.set(key, value);

        return new Response(JSON.stringify({ message: "Pesan disimpan ke Redis!" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("Redis error:", error.message || error);
        return new Response(JSON.stringify({ message: "Gagal menyimpan ke Redis" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
