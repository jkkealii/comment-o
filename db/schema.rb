# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180315215559) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "oser_id"
    t.boolean "edited", default: false
    t.integer "parent_id"
    t.integer "lft"
    t.integer "rgt"
    t.integer "depth", default: 0, null: false
    t.integer "children_count", default: 0, null: false
    t.index ["oser_id"], name: "index_comments_on_oser_id"
  end

  create_table "downvotes", force: :cascade do |t|
    t.bigint "oser_id"
    t.bigint "comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_downvotes_on_comment_id"
    t.index ["oser_id"], name: "index_downvotes_on_oser_id"
  end

  create_table "osers", force: :cascade do |t|
    t.string "username", null: false
    t.string "flair"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "role"
    t.string "flair_color"
    t.integer "comments_count", default: 0
  end

  create_table "upvotes", force: :cascade do |t|
    t.bigint "oser_id"
    t.bigint "comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_upvotes_on_comment_id"
    t.index ["oser_id"], name: "index_upvotes_on_oser_id"
  end

  add_foreign_key "comments", "osers"
end
