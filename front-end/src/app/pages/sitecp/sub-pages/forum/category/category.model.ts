import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class CategoryLeaf {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;
    @arrayOf(CategoryLeaf)
    children: Array<CategoryLeaf> = [];

    constructor (source: Partial<CategoryLeaf>) {
        ClassHelper.assign(this, source);
    }
}

export class CategoryOptions {
    @primitive()
    threadsNeedApproval: boolean;
    @primitive()
    postsDontCount: boolean;
    @primitive()
    prefixMandatory: boolean;
    @primitive()
    threadsCanHavePolls: boolean;
    @primitive()
    reportPostsGoHere: boolean;
    @primitive()
    jobApplicationsGoHere: boolean;
    @primitive()
    contactPostsGoHere: boolean;

    constructor (source?: Partial<CategoryOptions>) {
        ClassHelper.assign(this, source);
    }
}

export class Category {
    @primitive()
    categoryId: number;
    @primitive()
    parentId: number;
    @primitive()
    title: string;
    @primitive()
    description: string;
    @objectOf(CategoryOptions)
    options: CategoryOptions = new CategoryOptions();
    @primitive()
    displayOrder: number;
    @primitive()
    posts: number;
    @primitive()
    threads: number;
    @primitive()
    lastPostId: number;
    @primitive()
    template: string;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;
    @primitiveOf(Boolean)
    isHidden = false;
    @primitiveOf(Boolean)
    isOpen = true;
    @primitive()
    link: string;

    constructor (source?: Partial<Category>) {
        ClassHelper.assign(this, source);
    }
}

export class CategoryPage {
    @arrayOf(CategoryLeaf)
    forumTree: Array<CategoryLeaf> = [];
    @objectOf(Category)
    category: Category = new Category();

    constructor (source?: Partial<CategoryPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum CategoryActions {
    SAVE,
    DELETE,
    BACK
}