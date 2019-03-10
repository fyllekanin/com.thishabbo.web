<?php

use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('categories')->delete();
        \DB::table('categories')->insert(array (
            0 =>
            array (
                'categoryId' => 1,
                'parentId' => -1,
                'title' => 'General',
                'description' => 'ggg',
                'link' => '',
                'options' => 0,
                'displayOrder' => 0,
                'lastPostId' => 23,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552158684,
            ),
            1 =>
            array (
                'categoryId' => 2,
                'parentId' => 1,
                'title' => 'Announcements',
                'description' => 'Official announcements about ThisHabbo!',
                'link' => '',
                'options' => 0,
                'displayOrder' => 1,
                'lastPostId' => 21,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552158758,
            ),
            2 =>
            array (
                'categoryId' => 3,
                'parentId' => 1,
                'title' => 'Dev News',
                'description' => 'Check out all the latest development work on-goings here!',
                'link' => '',
                'options' => 0,
                'displayOrder' => 2,
                'lastPostId' => 23,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552158788,
            ),
            3 =>
            array (
                'categoryId' => 4,
                'parentId' => -1,
                'title' => 'Media',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 3,
                'lastPostId' => 34,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552148693,
            ),
            4 =>
            array (
                'categoryId' => 5,
                'parentId' => 4,
                'title' => 'News',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 1,
                'lastPostId' => 34,
                'isDeleted' => 0,
                'template' => 'MEDIA',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552148693,
            ),
            5 =>
            array (
                'categoryId' => 6,
                'parentId' => 4,
                'title' => 'Quests',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 2,
                'lastPostId' => 29,
                'isDeleted' => 0,
                'template' => 'QUEST',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552145142,
            ),
            6 =>
            array (
                'categoryId' => 7,
                'parentId' => 1,
                'title' => 'Welcome!',
                'description' => 'New? Introduce yourself! Leaving? Say goodbye!',
                'link' => '',
                'options' => 0,
                'displayOrder' => 3,
                'lastPostId' => 6,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1552158798,
            ),
            7 =>
            array (
                'categoryId' => 8,
                'parentId' => -1,
                'title' => 'Moderation & Applications',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 2,
                'lastPostId' => 20,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1547220711,
                'updatedAt' => 1547223762,
            ),
            8 =>
            array (
                'categoryId' => 9,
                'parentId' => 8,
                'title' => 'Reports',
                'description' => 'Reports that you\'ve sent to moderators',
                'link' => '',
                'options' => 0,
                'displayOrder' => 0,
                'lastPostId' => 20,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1547221324,
                'updatedAt' => 1547223762,
            ),
            9 =>
            array (
                'categoryId' => 10,
                'parentId' => 9,
                'title' => 'Sorted Reports',
                'description' => 'Resolved reports go in here',
                'link' => '',
                'options' => 16,
                'displayOrder' => 1,
                'lastPostId' => 20,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1547221397,
                'updatedAt' => 1547223762,
            ),
            10 =>
            array (
                'categoryId' => 11,
                'parentId' => 9,
                'title' => 'Tickets',
                'description' => 'Active tickets',
                'link' => '',
                'options' => 0,
                'displayOrder' => 0,
                'lastPostId' => 0,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1547222161,
                'updatedAt' => 1547222172,
            ),
        ));
    }
}