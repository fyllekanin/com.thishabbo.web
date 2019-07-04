export interface TreeDiagramSize {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export interface TreeDiagram {
    name: string;
    children?: Array<TreeDiagram>;
}

export const exampleData: TreeDiagram = {
    name: 'Usergroup',
    children: [
        {
            name: 'Ambassadors of Thishabbo',
            children: [
                {
                    name: 'Veteran',
                    children: [
                        {
                            name: 'Permissions',
                            children: [
                                {
                                    name: 'Can Access',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'Permissions',
                    children: [
                        {
                            name: 'Can Access',
                            children: []
                        },
                        {
                            name: 'Can Post',
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            name: 'ThisHabbo Staff Hub',
            children: [
                {
                    name: 'Administrator Lounge',
                    children: [
                        {
                            name: 'Ownership',
                            children: [
                                {
                                    name: 'Permissions',
                                    children: [
                                        {
                                            name: 'Can Access',
                                            children: []
                                        },
                                        {
                                            name: 'Can Post',
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Community Sitecps',
                            children: [
                                {
                                    name: 'Permissions',
                                    children: [
                                        {
                                            name: 'Can Access',
                                            children: []
                                        },
                                        {
                                            name: 'Can Post',
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'Permissions',
                    children: [
                        {
                            name: 'Can Access',
                            children: []
                        },
                        {
                            name: 'Can Post',
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
};
