const db = require("../../config/dbPostgreSQL");

const getCommentById = async (recipe_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT 
        comment.comment_id,
        comment.comment_text,
        comment.user_id,
        comment.recipe_id,
        to_char(comment.created_at, 'DD/MM/YYYY') AS formatted_created_at,
        users.name AS author,
        users.photo AS author_photo
      FROM 
        comment
      JOIN 
        users ON comment.user_id = users.id
      WHERE recipe_id = $1`,
      [recipe_id],
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};


const postComment = async (data) => {
  const { recipe_id, user_id, comment_text } = data;
  console.log(data);
  return new Promise((resolve, reject) =>
    db.query(
      `INSERT INTO comment (recipe_id, user_id, comment_text, created_at)
        VALUES ('${recipe_id}', '${user_id}', '${comment_text}', CURRENT_TIMESTAMP);
        `,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

module.exports = {
  getCommentById,
  postComment,
};
