class AddDefaultsToUpsAndDownsInComments < ActiveRecord::Migration[5.1]
  def change
    change_column_default :comments, :ups, 0
    change_column_default :comments, :downs, 0
  end
end
