// Cloudflare Pages Function
// Route: /go/wa  (deployed automatically by Cloudflare Pages from this file's path)
//
// Purpose: keep the real WhatsApp number out of the site's HTML source.
// Every "WhatsApp" button on the site links to /go/wa?msg=... instead of
// wa.me/<number>?text=... directly. This function is the only place the
// number lives; it 302-redirects the visitor straight to WhatsApp.
//
// To change the number later, edit WHATSAPP_NUMBER below and push - no
// need to touch any page.

const WHATSAPP_NUMBER = '17828026280'; // digits only, no +, spaces or dashes

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const msg = url.searchParams.get('msg');

  const target = msg
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return Response.redirect(target, 302);
}
