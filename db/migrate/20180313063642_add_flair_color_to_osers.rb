class AddFlairColorToOsers < ActiveRecord::Migration[5.1]
  def change
    add_column :osers, :flair_color, :string
  end
end
