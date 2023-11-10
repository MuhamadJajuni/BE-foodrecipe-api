const {
    getCommentById,
    postComment,
  } = require("../../models/products/modelRecipeComment");
  
  const productComment = {
    // Mengambil data comment
    getDataById: async (req, res, next) => {
      try {
        const { id } = req.params;
        console.log(id);
  
        if (!id || id <= 0 || isNaN(id)) {
          return res.status(404).json({ message: "recipe not found" });
        }
  
        let dataCommentId = await getCommentById(parseInt(id));
  
        if (!dataCommentId.rows[0]) {
          return res
            .status(200)
            .json({ status: 200, message: "comment not found", data: [] });
        }
  
        return res.status(200).json({
          status: 200,
          message: "get comment success",
          data: dataCommentId.rows,
        });
      } catch (err) {
        return res.status(404).json({ status: 404, message: err.message });
      }
    },
  
    // Menambahkan data comment
    postData: async (req, res, next) => {
      try {
        const { recipe_id, user_id, comment_text } = req.body;
        console.log(req.body);
  
        if (!comment_text) {
          return res.status(404).json({ message: "Comment text required" });
        }
        let data = {
          recipe_id: recipe_id,
          user_id: user_id,
          comment_text: comment_text,
        };
  
        console.log("data");
        console.log(data);
        let result = await postComment(data);
        console.log(result);
  
        return res
          .status(200)
          .json({ status: 200, message: "Comment success", data });
      } catch (err) {
        return res.status(404).json({ status: 404, message: err.message });
      }
    },
  };
  
  module.exports = productComment;
  