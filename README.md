# Dorayaki-Factory-Server
## Semester I Tahun 2021/2022 
### Tugas Besar II IF3110 Milestone 2 Pengembangan Aplikasi Berbasis Web

*Program Studi Teknik Informatika* <br />
*Sekolah Teknik Elektro dan Informatika* <br />
*Institut Teknologi Bandung* <br />

*Semester I Tahun 2021/2022*

## Deskripsi
Dorayaki-Factory-Server merupakan Web Service berbasis protokol REST yang menyediakan layanan backend untuk pabrik dorayaki. Dorayaki-Factory-Server dibangun menggunakan NodeJS dengan framework express.

## Fungsional Aplikasi
1. Melakukan registrasi dan login user
2. Mengelola bahan baku pabrik
3. Mengelola resep dorayaki
4. Mengelola request penambahan stok
## Author
1. Gde Anantha Priharsena (13519026)
2. Reihan Andhika Putra (13519043)
3. Reyhan Emyr Arrosyid (13519167)

## Requirements
- [NodeJS](https://nodejs.org/en/download/)

## Cara menjalankan
1. Download dan install semua requirement yang dibutuhkan
2. Clone repository ini
3. Buat file `.env` berdasrakan `.env.example` dan isi datanya
4. Ketikkan command 
```
npm install
npm start
```
4. Testing API dapat dilakukan dengan menggunakan [Postman](https://www.postman.com/)
## Skema Basis Data
### Tabel User
| Atribut     | Tipe |
| ----------- | ----------- |
| <u>id</u>      | char(36)       |
| username   | varchar(255)        |
| email   | varchar(255)        |
| password   | varchar(255)        |

### Tabel Ingredients
| Atribut     | Tipe |
| ----------- | ----------- |
| <u>id</u>      | char(36)       |
| name   | varchar(255)        |
| stock   | int        |

### Tabel Recipes
| Atribut     | Tipe |
| ----------- | ----------- |
| <u>id</u>      | char(36)       |
| name   | varchar(255)        |

### Tabel Recipe_Ingredients
| Atribut     | Tipe |
| ----------- | ----------- |
| <u>id</u>      | char(36)       |
| <u>ingredient</u>   | char(36)        |
| count   | int        |

### Tabel Requests
| Atribut     | Tipe |
| ----------- | ----------- |
| <u>id</u>      | char(36)       |
| ip   | varchar(255)        |
| dorayaki   | varchar(255)        |
| count   | int        |
| status   | enum        |
| recognized   | tinyint(1)      |
### Tabel Log Request
| Atribut     | Tipe |
| ----------- | ----------- |
| <u>id</u>      | char(36)       |
| ip   | varchar(255)        |
| endpoint   | varchar(255)        |
| timestamp   | datetime        |

## Pembagian Kerja
1. Database Pabrik : 13519167
2. Autentikasi Pengguna : 13519167
3. Pengelolaan Request Penambahan Stok : 13519026, 13519043, 13519167
4. Manajemen Resep : 13519043, 13519167
5. Manajemen Bahan Baku : 13519167
6. Notifikasi Email : 13519026, 13519167
## Endpoints
### Auth
- POST /api/v1/auth/register
  - Register user
- POST /api/v1/auth/login
  - Login user
  
### Ingredients
- GET /api/v1/ingredients
  - Get all ingredients
- POST /api/v1/ingredients
  - Add a new ingredient
- GET /api/v1/ingredients/:id
  - Get ingredient by id
- PATCH /api/v1/ingredients/:id
  - Update ingredient
  
### Requests
- GET /api/v1/requests
  - Get all requests
- POST /api/v1/requests
  - Add a new request
- GET /api/v1/requests/:id
  - Get request by id
- PATCH /api/v1/requests/:id
  - Update request
- POST /api/v1/requests/:id/accept
  - Accept a request
- POST /api/v1/requests/:id/decline
  - Decline a request
  
### Recipes
- GET /api/v1/recipes
  - Get all recipes
- GET /api/v1/recipes/names
  - Get all recipe names
- POST /api/v1/recipes
  - Add a new recipe