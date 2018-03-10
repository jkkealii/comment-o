class AddRoleToOsers < ActiveRecord::Migration[5.1]
  def change
    add_column :osers, :role, :string
    Oser.all.each do |oser|
      oser.update(role: 'oser') if oser.role.nil?
    end
  end
end
