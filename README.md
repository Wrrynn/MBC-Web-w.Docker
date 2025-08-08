# Website MBC Lab - w/Docker 

Ini adalah proyek lanjutan dari website mbc lab yang berisi integrasi  web sederhana dengan backend redis.
Dalam proyek ini menggunakan Docker yang terdiri dari; 

├── Docker Compose 

└── Docker Swarm

Redis yang digunakan sebagai penyimpanan cache/bertipe persistent data.

---
```
Struktur file tambahan 

MBC-Web-w-Docker/
├── app/
│   ├── api/contact
│   │   └── route.js
│   └── lib/
│       └── redis.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── secret-pass.txt
└── ...

```

## Tahapan

1. **Membuat Docker File**
   
   Dockerfile adalah file konfigurasi teks sederhana berisi instruksi yang memberitahu Docker bagaimana cara membangun image dari aplikasi kita.

2. **Membuat Docker ignore**
   
   Agar file yang tidak perlu tidak dikopi ke container:
   contohnya:
   ```
      .env
      .log
   ```

3. **Menambahkan Redis**
   
   Redis dapat dibuat melalui cmd, agar redis bersifat persistent tambahkan appendonly dan tambahkan requirepass

   ```bash
      docker run -d --name redis-server-mbc-web 
      -p 6379:6379 
      -v redis_data:/data 
      redis redis-server 
      --requirepass Admin123
      --dir /data 
      --appendonly yes
   ```

4. **Hubungkan Redis dengan proyek**
   
   Redis dapat dihubungkan dengan proyek melalui folder lib/redis.js, 
   gunakan url 'redis://default:[pass]@redis:[port]'
   dan process.env.REDIS_URL untuk mengambil enviroment dari handler

   ```
      url: process.env.REDIS_URL || 'redis:default:Admin123@redis:6379'
   ```

5. **Handler Post**
   
   Perbaiki handler post pada app/api/contact/route.js agar dapat terhubung dengan redis

   ```bash
      app.post('/data', async (req, res) => {
         const { key, value } = req.body;
         await redisClient.set(key, value);
         res.send(`Data disimpan: ${key} => ${value}`);
      });
   ```

6. **Menambahkan Redis Secret**
   
   Mengisi file secret-pass.txt dengan password redis
   ```
      Admin123
   ```

7. **Membuat Redis Compose**
   
   File redis compose terdiri dari services yang berisi 
   ├── redis

   ├── web

   └── deploy

   serta volumes dan secret yang terhubung ke secret-pass.txt

   comamnd yang dilakukan pada cmd adalah 
   ```bash
   docker compose up --build      # Membuat dan menjalankan compose
   docker compose up -d           # Menjalankan compose 
   docker compose stop            # Menghentikan dan menghapus container sementara
   docker compose down            # Menghapus container 
   docker compose ps              # Melihat container yang aktif
   ```

8. **Membuat Redis Swarm**
   Redis swarm dapat dibuat dengan menginisialisasi
   ```
      docker swarm init 
   ```
   Deploy stack untuk menjalakan
   ```
      docker stack deploy -c docker-compose.yml mbc_stack
   ```
   Tambahan
   ```bash
      docker stack ls                  # Melihat stack yang aktif
      docker stack services mbc_stack  # Melihat service dalam stack
      docker stack service [id]=0      # Menonaktifkan container sementara
      docker stack service [id]=[n]    # Mengaktifkan container sebanyak jumlah yang diinginkan
      docker stack rm [nama_stack]     # Menghapus stack
   ```
   
## Catatan Penting
   ```bash
      docker ps                           # Melihat container yang aktif
      docker excec -it [names] redis-cli  # Masuk ke redis
      #jika masuk ke redis masukkan password redis kemudian dapat mengakses isi redis dengan 
      Auth [pass]    #masukan authorisasi
      keys *         #untuk menampilkan semua pesan
      get [pesan]    #untuk mengambil pesan
      exit # Untuk keluar dari redis
      
      # untuk melihat password redis 
      docker exec -it (docker ps -qf "name=mbc_stack_redis") sh
      #kemudian  gunakan cat 
      cat /run/secrets/redis_password
   ```

## Author
I Made Dwi Wiryawan Raditya<br>
2526<br>
Informatika(2023)
---