const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((title) => {
      return {
        note_id,
        title,
        user_id,
      };
    });

    await knex("movieTags").insert(tagsInsert);

    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movieTags")
      .where({ note_id: id })
      .orderBy("title");

    return response.json({ ...note, tags });
  }

  async delete(request, response) {
    const { id } = request.params;
    await knex("movieNotes").where({ id }).delete();
    response.json();
  }

  async index(request, response) {
    const { title, user_id, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim()); //split converte o texto em array como delimitador a virgula e o trim retira os espaços em brancos do array
      notes = await knex("movieTags")
        .select(["movieNotes.id", "movieNotes.title", "movieNotes.user_id"])
        .where("movieNotes.user_id", user_id)
        .whereILike("title", `%${title}%`)
        .whereIn("title", filterTags)
        .innerJoin("movieTags", "movieNotes.id", "movieTags.note_id")
        .orderBy("movieNotes.title");
    } else {
      notes = await knex("movieNotes")
        .where({ user_id })
        .whereNull("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movieTags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);
      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;
