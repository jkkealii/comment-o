class AddNestedToComments < ActiveRecord::Migration[5.1]
  def change
    add_column :comments, :lft, :integer, index: true
    add_column :comments, :rgt, :integer, index: true

    add_column :comments, :depth, :integer, null: false, default: 0
    add_column :comments, :children_count, :integer, null: false, default: 0

    # This is necessary to update :lft and :rgt columns
    Comment.rebuild!
  end
end
