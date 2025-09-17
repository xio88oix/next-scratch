External.define('Shark.view.transportation.pkg.PackageAcknowledgementGrid', {
    extend: 'Shark.grid.Base',
    xtype: 'packageacknowledgementgrid',
    reference: 'packageacknowledgementgrid',
    //Used for saving state and building links.
    viewName: 'packageacknowledgement',
    title: 'Package Acknowledgement',
    showPrint: false,
    showPrintScope: false,
    defaultType: 'grid',
     requires: ['Shark.grid.Base',
        'Shark.view.transportation.pkg.PackageAcknowledgementGridController',
        'Shark.view.transportation.pkg.PackageAcknowledgementGridModel',
        'Shark.store.transportation.pkg.PackageAcknowledgement',
        'Shark.view.customcontrols.DisableableCheckboxModel',
        'Shark.window.transportation.pkg.PackageAcknowledgementDetailWindow'    
     ],
    controller: 'packageacknowledgementgrid',
    viewModel: {
        type: 'packageacknowledgementgrid'
    },
    listeners: {

    },
    hhInitParams: '',
    bind:'{gridstore}',
    initComponent: function() {
        var me = this;
        me.advancedSearch = true;
        if (me.defaultQueryParams) {
            me.fields = me.defaultQueryParams;  
        }
        if (me.hhInitParams) {
            External.apply(me.fields,me.hhInitParams);
        }
        me.selModel = External.create('Ext.selection.CheckboxModel', {checkOnly: true});
        me.extraButtons = ['-',{
            xtype: 'combo',
            emptyText: 'Quick Actions',
            displayField: 'name',
            valueField: 'value',
            matchFieldWidth: false,
            name: 'quickActions',
            disabled: true,
            listConfig: {width: 200},
            width: 105,
            store: External.create('Ext.data.ArrayStore', {
                fields: ['name', 'value', 'enabled'],
                data: [
                    ['Acknowledge Delivery',1,true],
                    ['Report Package Issue',2,true]
                                ]
            }),
            tpl: External.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item" style="{[values.enabled ? "" : "color:gray;"]}">{name}</div>',
                '</tpl>'
            ),
            listWidth: 200,
            listeners: {
                select: me.doQuickAction,
                scope: me,
                beforeselect: function(c, r) {
                    return r.get('enabled');    
                }
            },


        }];
        me.columns = [{
            header: 'id',
            dataIndex: 'id',
            hidden: true
        },{
            header: 'SON',
            dataIndex: 'packageId',
        },{
            header: 'Status',
            dataIndex: 'cargoStatusDisplay',
                    },{
            header: 'Mission Offload',
            dataIndex: 'missionOffload',
                    },{
                        xtype: 'datecolumn',
            header: 'Acknowledgement Date',
            dataIndex: 'receivedDate',
            format: 'm/d/Y'
                    }];
                    
        me.on('selectionchange', me.onSelectionChange, me);
        me.on('itemdblclick', me.onDoubleClick, me);

        me.viewConfig = {
            emptyText: 'No records to display',
            deferEmptyText: false,
            getRowClass: function(record, rowIndex, rowParams, store){
                if (record.get('cargoStatus') == 'RECEIVED') {
                    return 'acknowledged-row';
                }
            }
        };
        me.callParent(arguments);

    },
    createFilterWindow : function() {
        var me = this;
        return External.create('Ext.window.Window', {
            title: 'Advanced Search',
            autoHeight: true,
            width: 800,
            buttonAlign : 'center',
            layout : 'fit',
            resizable: false,
            defaultFocus : 'son',
            currentSettings:me.getFieldValues(),
            items: [{
                xtype: 'form',
                border : 0,
                layout : 'fit',
                bodyPadding: 5,
                fieldDefaults : {
                    labelAlign : 'right',
                    labelWidth : 180,
                    width: 380
                },
                items: [{
                    xtype: 'container',
                    anchor: '100%',
                    layout: 'column',
                    items : [
                        { 
                            xtype: 'container',
                            columnWidth: '0.5',
                            layout: 'anchor',
                            defaultType: 'textfield',
                            items : [ {
                                fieldLabel: 'SON',
                                name: 'son',
                                itemId: 'son',
                            },{
                                xtype: 'datefield',
                                fieldLabel: 'Acknowledgement Date (From)',
                                editable : false,
                                name: 'startDate',
                                endDateField: 'endDate',
                                vtype: 'dateRange',
                            },{
                                fieldLabel: 'Mission Offload',
                                name: 'missionOffload',}
                            }
                            }]
                    ]
                    defaults: {
                defaults: {
            modal: true,
        })
    }
})