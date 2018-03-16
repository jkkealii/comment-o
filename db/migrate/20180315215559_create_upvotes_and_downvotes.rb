class CreateUpvotesAndDownvotes < ActiveRecord::Migration[5.1]
  def change
    create_table :upvotes do |t|
      t.belongs_to :oser
      t.belongs_to :comment
      t.timestamps
    end

    create_table :downvotes do |t|
      t.belongs_to :oser
      t.belongs_to :comment
      t.timestamps
    end

    remove_column :comments, :ups, :integer, default: 0
    remove_column :comments, :downs, :integer, default: 0
  end
end
