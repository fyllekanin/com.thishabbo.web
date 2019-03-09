<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->delete();
        DB::table('categories')->insert(array (
            0 =>
            array (
                'categoryId' => 1,
                'parentId' => -1,
                'title' => 'General',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 0,
                'lastPostId' => 6,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547222172,
            ),
            1 =>
            array (
                'categoryId' => 2,
                'parentId' => 1,
                'title' => 'Announcements',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 1,
                'lastPostId' => 3,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547222172,
            ),
            2 =>
            array (
                'categoryId' => 3,
                'parentId' => 1,
                'title' => 'Dev News',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 2,
                'lastPostId' => 4,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547222172,
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
                'lastPostId' => 16,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547222172,
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
                'lastPostId' => 16,
                'isDeleted' => 0,
                'template' => 'MEDIA',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547223565,
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
                'lastPostId' => 11,
                'isDeleted' => 0,
                'template' => 'QUEST',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547222172,
            ),
            6 =>
            array (
                'categoryId' => 7,
                'parentId' => 1,
                'title' => 'Welcome!',
                'description' => '',
                'link' => '',
                'options' => 0,
                'displayOrder' => 3,
                'lastPostId' => 6,
                'isDeleted' => 0,
                'template' => 'DEFAULT',
                'isHidden' => 0,
                'isOpen' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1547222172,
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
