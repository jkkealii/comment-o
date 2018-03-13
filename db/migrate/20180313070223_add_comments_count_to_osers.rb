class AddCommentsCountToOsers < ActiveRecord::Migration[5.1]
  def change
    add_column :osers, :comments_count, :integer, default: 0
  end
end
