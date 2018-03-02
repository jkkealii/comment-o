require 'test_helper'

class OserTest < ActiveSupport::TestCase
  def setup
    @oser = Oser.new(username: 'test_oser', flair: 'tester', password: 'password', password_confirmation: 'password')
  end

  test 'new oser is valid' do
    assert @oser.valid?
  end
end
