-- Create the view that the feedback system needs
CREATE OR REPLACE VIEW public.feedback_requests_with_details AS
SELECT
    fr.*,
    ul.name AS creator_name,
    ul.email AS creator_email,
    ul.avatar_url AS creator_avatar,
    COALESCE(v.user_votes, '[]'::json) AS voters,
    EXISTS (
        SELECT 1 FROM public.feedback_votes fv
        WHERE fv.request_id = fr.id AND fv.user_id = auth.uid()::UUID
    ) AS user_has_voted
FROM public.feedback_requests fr
LEFT JOIN public.users_login ul ON fr.created_by = ul.user_id
LEFT JOIN (
    SELECT
        fv.request_id,
        json_agg(
            json_build_object(
                'user_id', fv.user_id,
                'user_name', uvl.name,
                'user_email', uvl.email,
                'user_avatar', uvl.avatar_url,
                'voted_at', fv.created_at
            )
        ) AS user_votes
    FROM public.feedback_votes fv
    LEFT JOIN public.users_login uvl ON fv.user_id = uvl.user_id
    GROUP BY fv.request_id
) v ON fr.id = v.request_id;