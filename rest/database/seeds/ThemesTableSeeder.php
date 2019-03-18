<?php

use Illuminate\Database\Seeder;

class ThemesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('themes')->delete();
        
        \DB::table('themes')->insert(array (
            0 => 
            array (
                'themeId' => 1,
                'title' => 'Dark Theme',
                'isDefault' => 0,
            'minified' => 'app-top-bar .wrapper{box-shadow:0 1px #403d3d,0 1px 3px #1b1b1b!important;background:-webkit-linear-gradient(top,#403d3d 0,#403d3d 100%)!important}app-header .big-header{background:#3c3c3c url(/assets/images/skyline.png) repeat-x bottom!important}app-top-box .experience{background:transparent!important;box-shadow:rgb(19,19,19) 0 0 0 1px inset,rgba(255,255,255,.07) 0 0 0 2px inset,rgba(0,0,0,.12) 0 2px 0!important}app-top-box .experience-percentage{box-shadow:rgba(0,0,0,.87) 0 0 0 1px inset,rgba(255,255,255,.15) 0 0 0 2px inset,rgba(0,0,0,0) 0 2px 0!important;background:#037cd2!important}app-top-box .experience-level{color:#c7c7c7}app-top-box .welcome{color:#b1aeae!important}app-radio .radio-info,.event-info{background:transparent!important;border:none!important}app-radio .dj-position{background:transparent!important}.radio-button,button,.events-box-button{opacity:0.6!important}.event-name,.current-event{background:transparent!important}.dropdown-content{background:-webkit-linear-gradient(top,#2f2f2f 0,#2d2d2d 100%)!important}.dropdown-content a{color:#527daf}.dropdown-content a:hover{background:-webkit-linear-gradient(top,#2f2f2f 0,#2d2d2d 100%)!important}.dropdown-content .divider{background-color:#5f5f5f!important}app-header .bottom-bar{background:-webkit-linear-gradient(top,#444444 0,#333333 100%)!important;box-shadow:0 1px #424242,0 1px 7px #00000042!important}app-header .tab{background:-webkit-linear-gradient(top,#444444 0,#444444 100%)!important}',
                'css' => 'app-top-bar .wrapper {
box-shadow: 0 1px #403d3d, 0 1px 3px #1b1b1b !important;
background: -webkit-linear-gradient(top, #403d3d 0, #403d3d 100%) !important;
}

app-header .big-header {
background: #3c3c3c url(/assets/images/skyline.png) repeat-x bottom !important;
}

app-top-box .experience {
background: transparent !important;
box-shadow: rgb(19, 19, 19) 0 0 0 1px inset, rgba(255, 255, 255, 0.07) 0 0 0 2px inset, rgba(0, 0, 0, 0.12) 0 2px 0 !important;
}

app-top-box .experience-percentage {
box-shadow: rgba(0, 0, 0, 0.87) 0 0 0 1px inset, rgba(255, 255, 255, 0.15) 0 0 0 2px inset, rgba(0, 0, 0, 0) 0 2px 0 !important;
background: #037cd2 !important;
}

app-top-box .experience-level {
color: #c7c7c7;
}

app-top-box .welcome {
color: #b1aeae !important;
}

app-radio .radio-info , .event-info {
background: transparent !important;
border: none !important;
}

app-radio .dj-position {
background: transparent !important;
}

.radio-button , button , .events-box-button {
opacity: 0.6 !important;
}

.event-name , .current-event {
background: transparent !important;
}

.dropdown-content {
background: -webkit-linear-gradient(top, #2f2f2f 0, #2d2d2d 100%) !important;
}

.dropdown-content a {
color: #527daf;
}

.dropdown-content a:hover {
background: -webkit-linear-gradient(top, #2f2f2f 0, #2d2d2d 100%) !important;
}

.dropdown-content .divider {
background-color: #5f5f5f !important;
}

app-header .bottom-bar {
background: -webkit-linear-gradient(top, #444444 0, #333333 100%) !important;
box-shadow: 0 1px #424242, 0 1px 7px #00000042 !important;
}

app-header .tab {
background: -webkit-linear-gradient(top, #444444 0, #444444 100%) !important;
}',
                'isDeleted' => 0,
                'createdAt' => 1552839531,
                'updatedAt' => 1552840084,
            ),
        ));
        
        
    }
}
