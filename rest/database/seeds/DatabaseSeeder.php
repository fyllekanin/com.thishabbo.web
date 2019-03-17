<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run () {
        $this->call(BBcodesTableSeeder::class);
        $this->call(NoticesTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        $this->call(ForumPermissionsTableSeeder::class);
        $this->call(GroupsTableSeeder::class);
        $this->call(PostsTableSeeder::class);
        $this->call(PrefixesTableSeeder::class);
        $this->call(SettingsTableSeeder::class);
        $this->call(TemplatedataTableSeeder::class);
        $this->call(ThreadsTableSeeder::class);
        $this->call(ParagraphsTableSeeder::class);
        $this->call(EventsTableSeeder::class);
        $this->call(BadgesTableSeeder::class);
        $this->call(BetcategoriesTableSeeder::class);
        $this->call(BetsTableSeeder::class);
        $this->call(UserdataTableSeeder::class);
        $this->call(InfractionLevelsTableSeeder::class);
        $this->call(AutoBansTableSeeder::class);
        $this->call(NotificationsTableSeeder::class);
        $this->call(PagesTableSeeder::class);
        $this->call(ThemesTableSeeder::class);
    }
}
