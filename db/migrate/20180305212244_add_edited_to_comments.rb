class AddEditedToComments < ActiveRecord::Migration[5.1]
  def change
    add_column :comments, :edited, :boolean, default: false
  end
end
