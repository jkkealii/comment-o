require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  def setup
    @oser = Oser.new(username: 'test_oser', flair: 'tester', password: 'password', password_confirmation: 'password')
    if @oser.save
      @comment = Comment.new(content: 'this is a test comment!', ups: 2, downs: 1, oser_id: @oser.id)
    end
  end

  test 'new comment is valid' do
    assert @comment.valid?
  end
end
