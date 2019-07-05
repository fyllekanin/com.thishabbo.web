<?php

use Illuminate\Database\Seeder;

class SubscriptionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('subscriptions')->delete();
        
        \DB::table('subscriptions')->insert(array (
            0 => 
            array (
                'subscriptionId' => 1,
                'title' => 'Color',
                'avatarWidth' => 0,
                'avatarHeight' => 0,
                'credits' => 200,
                'pounds' => 0,
                'options' => 5,
                'isDeleted' => 0,
                'createdAt' => 1562312018,
                'updatedAt' => 1562312038,
            ),
            1 => 
            array (
                'subscriptionId' => 2,
                'title' => 'Position',
                'avatarWidth' => 0,
                'avatarHeight' => 0,
                'credits' => 200,
                'pounds' => 0,
                'options' => 6,
                'isDeleted' => 0,
                'createdAt' => 1562312029,
                'updatedAt' => 1562312043,
            ),
            2 => 
            array (
                'subscriptionId' => 3,
                'title' => 'Color & Position',
                'avatarWidth' => 0,
                'avatarHeight' => 0,
                'credits' => 500,
                'pounds' => 0,
                'options' => 7,
                'isDeleted' => 0,
                'createdAt' => 1562312054,
                'updatedAt' => 1562312059,
            ),
            3 => 
            array (
                'subscriptionId' => 4,
                'title' => 'Avatar',
                'avatarWidth' => 200,
                'avatarHeight' => 500,
                'credits' => 0,
                'pounds' => 2,
                'options' => 4,
                'isDeleted' => 0,
                'createdAt' => 1562312069,
                'updatedAt' => 1562312342,
            ),
        ));
        
        
    }
}