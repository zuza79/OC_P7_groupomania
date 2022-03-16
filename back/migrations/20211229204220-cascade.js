'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('likes', 'UserId', {

        name : 'likes_UserId',
        type: 'foreign key',
        references: {
					model: 'Users',
					key: 'id'
				},
        onDelete: 'CASCADE',
    
      }
    );

    await queryInterface.addConstraint('likes', 'PostId', {

      name : 'likes_PostId',
      type: 'foreign key',
      references: {
        model: 'Posts',
        key: 'id'
      },
      onDelete: 'CASCADE',
  
    }
  );

  await queryInterface.addConstraint('dislikes', 'UserId', {

    name : 'dislikes_UserId',
    type: 'foreign key',
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',

  }
);

await queryInterface.addConstraint('dislikes', 'PostId', {

  name : 'dislikes_PostId',
  type: 'foreign key',
  references: {
    model: 'Posts',
    key: 'id'
  },
  onDelete: 'CASCADE',

}
);
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
