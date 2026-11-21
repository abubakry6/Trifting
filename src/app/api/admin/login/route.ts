import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const trimmedInputEmail = email.trim().toLowerCase();
    const expectedEmail = (process.env.ADMIN_EMAIL || "admin@trifting.com").trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "TriftingMaster#2024";

    // Strict authentication check
    const isEmailValid = trimmedInputEmail === expectedEmail;
    const isPasswordValid = password === expectedPassword;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Akses ditolak: Email atau Kata Sandi Admin tidak valid." 
        },
        { status: 401 }
      );
    }

    // Success response with admin identity
    return NextResponse.json({
      success: true,
      message: "Otentikasi Super Admin berhasil.",
      user: {
        id: "admin-master",
        email: expectedEmail,
        fullName: "Store Owner (Super Admin)",
        role: "admin",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server saat memproses login." },
      { status: 500 }
    );
  }
}
