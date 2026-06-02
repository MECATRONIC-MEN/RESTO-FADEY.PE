import { jsonOk, jsonError } from '@/lib/api/server-auth';
import {
  createVisitorRating,
  listApprovedVisitorRatings,
  visitorRatingToTestimonial,
} from '@/lib/services/visitor-ratings';
import type { VisitorRatingInput } from '@/lib/domain/types';

/** GET — calificaciones aprobadas para el carrusel público */
export async function GET() {
  try {
    const rows = await listApprovedVisitorRatings();
    return jsonOk(rows.map(visitorRatingToTestimonial));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}

/** POST — enviar calificación desde la landing */
export async function POST(request: Request) {
  let body: VisitorRatingInput;
  try {
    body = await request.json();
  } catch {
    return jsonError('JSON inválido');
  }

  const rating = Number(body.rating);
  if (
    !body.name?.trim() ||
    !body.restaurant?.trim() ||
    !body.role?.trim() ||
    !body.comment?.trim()
  ) {
    return jsonError('nombre, restaurante, cargo y comentario son requeridos');
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return jsonError('La calificación debe ser entre 1 y 5 estrellas');
  }

  try {
    const record = await createVisitorRating({
      name: body.name.trim(),
      restaurant: body.restaurant.trim(),
      role: body.role.trim(),
      comment: body.comment.trim(),
      result: body.result?.trim(),
      rating: Math.round(rating),
    });
    return jsonOk(
      {
        id: record.id,
        message:
          'Gracias por tu calificación. La revisaremos y pronto podrá aparecer en esta sección.',
        preview: visitorRatingToTestimonial(record),
      },
      201
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Error', 500);
  }
}
