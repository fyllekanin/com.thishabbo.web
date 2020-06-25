import { PrefixComponent } from './prefixes/prefix/prefix.component';
import { PermissionsResolver } from './services/permissions.resolver';
import { PermissionsComponent } from './permissions/permissions.component';
import { CategoryResolver } from './services/category.resolver';
import { CategoryComponent } from './category/category.component';
import { CategoriesListResolver } from './services/categories-list.resolver';
import { CategoriesListComponent } from './list/categories-list.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { PrefixListComponent } from './prefixes/prefix-list/prefix-list.component';
import { PrefixListResolver } from './services/prefix-list.resolver';
import { PrefixService } from './services/prefix.resolver';
import { GroupTreeComponent } from './group-tree/group-tree.component';
import { GroupTreeResolver } from './services/group-tree.resolver';
import { ThreadTemplateListComponent } from './thread-templates/thread-template-list/thread-template-list.component';
import { ThreadTemplateComponent } from './thread-templates/thread-template/thread-template.component';
import { ThreadTemplateService } from './services/thread-template.service';
import { ThreadTemplateListResolver } from './services/thread-template-list.resolver';

export const forumRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'categories/page/1'
            },
            {
                path: 'categories/page/:page',
                component: CategoriesListComponent,
                resolve: {
                    data: CategoriesListResolver
                }
            },
            {
                path: 'categories/:categoryId',
                component: CategoryComponent,
                resolve: {
                    data: CategoryResolver
                }
            },
            {
                path: 'categories/:categoryId/permissions/:groupId',
                component: PermissionsComponent,
                resolve: {
                    data: PermissionsResolver
                }
            },
            {
                path: 'prefixes/page/:page',
                component: PrefixListComponent,
                resolve: {
                    data: PrefixListResolver
                }
            },
            {
                path: 'prefixes/:prefixId',
                component: PrefixComponent,
                resolve: {
                    data: PrefixService
                }
            },
            {
                path: 'thread-templates/page/:page',
                component: ThreadTemplateListComponent,
                resolve: {
                    data: ThreadTemplateListResolver
                }
            },
            {
                path: 'thread-templates/:threadTemplateId',
                component: ThreadTemplateComponent,
                resolve: {
                    data: ThreadTemplateService
                }
            },
            {
                path: 'categories/:categoryId/groups',
                component: GroupTreeComponent,
                resolve: {
                    data: GroupTreeResolver
                }
            }
        ]
    }
];
