require('lodash');
import { AComponent } from '../../Classes/AComponent'

class SortableList extends AComponent {
    
    constructor(){
        super()
        
        this.configuration = {
        
            model: {},
            title: '',
            table: [],
            defaultOrder: null,
            selected: null,
            limit: 10,
            showControls: true,
        
            template: require('./SortableList.html'),
            bindings : {
                source: '=',
                title: '=',
                limit: '=',
                showControls: '='
            }
        
        }
        
        this.templateManager = new ListTemplate( this.$scope, this.compile );
        
    }
    
    controller(){
        this.level = 'sortable'
    
        this.test('original')
    
    }
    
    test( ciao, ApplicationsFactory ){
        console.log('sortablelist', ciao, ApplicationsFactory);
    }
    
    SortableList( ciao, ApplicationsFactory ){
    }
    
    initialize(){

        // this.configuration.model = this.ApplicationsFactory;

        // // Update config parameter se in view
        this.configuration.showControls = this.showControls !== undefined ? this.showControls:this.configuration.showControls;
        this.configuration.title = this.title !== undefined ? this.title : this.configuration.title ;
        this.configuration.limit = this.limit !== undefined ? this.limit : this.configuration.limit ;

        // handle filter preset on page load
        if( ! this.configuration.selected ) {
            this.configuration.selected = _.find (this.configuration.table, { 'property' : this.configuration.defaultOrder } )
        }

    }
    
    toggle (element) {
        
        console.log('toggle', this);
        
        // Iterate table to find clicked column
        _.each( this.configuration.table , (header, header_key) => {
            
            // Check if this is the clicked column
            let isClickedHeader = angular.equals(header, element);
            
            // Order by clicked column
            if(isClickedHeader){
                header.value =  !header.value ;
                this.configuration.selected = header;
            }
            else
                header.value = '  ' ;
            
        });
        
        // Set default order
        this.configuration.defaultOrder = this.configuration.selected.property;
    
    }
    
    get( obj, property , $ubiModal) {
        
        let value = _.get(obj, property);
        // console.log('get', $ubiModal);
    
        if(isNaN(value))
            return _.trim( value );
        
        return parseInt( value ) || '';
    
    }
 
    editLimit(limit) {
        this.configuration.limit = limit;
    }
    
    itemSortValue($this){
        return (item) => {
            
            let value = _.get(item, $this.configuration.defaultOrder) ;

            // Check if value is equivalent to null
            let isNullValue = ! value || ( _.isArray(value) && value.length > 0 ) || ( typeof value == 'string' && _.trim(value) == '' )
            
            // Push null equvalent values to bottom
            if( isNullValue && ! _.get($this.configuration ,'selected.value') ) return 1000
            return value
            
        }
    }
    
}

class ListTemplate {
    
    constructor($scope, $compile){
        this.$scope = $scope;
        this.compile = $compile;
    }
    
    compileHtml( html ){
        return this.compile( html )( this.$scope );
    }
    
    getTemplate(field) {
        if(field.url)
            return this.url(field.url);
        if(field.issue)
            return this.issues();
        if(field.array)
            return this.array();
        if(field.html)
            return this.html(field.html);
        if(field.property)
            return  this.value();
        if(field.action)
            return this.action();
    }
    
    html(html){
        return `
        <span>${html}</span>
        `
    }
    
    url (url) {
        return `
        <a ng-href="${url}">
            <span ng-if="ctrl.get(element , field.property) && !field.icon">{{ ctrl.get(element , field.property) }}</span>
            <span ng-if="field.icon" class="glyphicon glyphicon-{{ field.icon }}"></span>
        </a>`;
    }
    
    issues () {
        return `<span ng-if="ctrl.get(element , field.issue) && ctrl.get(element , field.issue) != ''" class="glyphicon glyphicon-{[{ field.icon }]}"></span>`;
    }
    
    array() {
        return `
                <!--<span ng-if="{{ ctrl.get(element , field.property) && ctrl.get(element , field.property).length }}">-->
                <span>
                    <span>
                        <p ng-repeat="item in ctrl.get(element , field.property)">      
                            <span ng-if="ctrl.get(item, field.array)">{{ ctrl.get(item, field.array) }}</span>
                        </p>
                    </span>
              
                    <span ng-if="{{ ctrl.get(element , field.property ).length == 0 }}">
                        --
                </span>
				`;
    }
    action() {
        return `<span ng-if="ctrl.isArray(field.action)">
                    <span ng-repeat="item in field.action track by $index">
                       <a ng-if="item.linkUrl" href="{[{item.linkUrl + element.id}]}">
                            <span class="glyphicon glyphicon-{[{ item.icon }]}"></span>      
                       </a>
                       <!--- <a ng-if="item.actionUrl" data-toggle="modal" data-target="#confirmModal" ng-click="ctrl.actionURLGenerator(element, item.actionUrl + element.id, item.objectNameProperties, item.actionName)">
                            <span class="glyphicon glyphicon-{[{ item.icon }]}"></span>
                       </a> --->
					   <modal-confirm ng-if="item.actionUrl" object-name="{[{ element.shortName }]}" action-url="{[{item.actionUrl}]}{[{element.id}]}" action-icon="{[{item.icon}]}" action-name="{[{item.actionName}]}"></modal-confirm>
					</span>
				</span>`;
    }
    value () {
        return `<span> {{ ctrl.get(element , field.property)}} </span>`;
    }
    
}


export { SortableList }


