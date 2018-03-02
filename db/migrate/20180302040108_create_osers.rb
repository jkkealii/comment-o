class CreateOsers < ActiveRecord::Migration[5.1]
  def change
    create_table :osers do |t|
      t.string :username, null: false
      t.string :flair

      t.timestamps
    end
  end
end
