export async function GET() {

    const content = "Hello, World!";
    const filename = "super_official_pass.txt";
    const pass = new Blob([content], { type: "text/plain" });

    return new Response(pass, {
        headers: {
            "Content-Type": "text/plain",
            "Content-Disposition": `attachment; filename=${filename}`,
        },
    });
}

export const runtime = "edge";
export const revalidate = 1;