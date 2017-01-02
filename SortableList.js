require('lodash');
import { AComponent } from './AComponent'
 
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
        
    }
    
    initialize(){

        // this.configuration.model = this.ApplicationsFactory;

        // // Update config parameter se in view
        this.configuration.showControls = this.showControls != undefined ? this.showControls:this.configuration.showControls;
        this.configuration.title = this.title != undefined ? this.title : this.configuration.title ;
        this.configuration.limit = this.limit != undefined ? this.limit : this.configuration.limit ;

        // handle filter preset on page load
        if( ! this.configuration.selected ) {
            this.configuration.selected = _.find (this.configuration.table, { 'property' : this.configuration.defaultOrder } )
        }

    }
    
    toggle (element) {
        
        // Iterate table to find clicked column
        _.each( this.configuration.table , (header, header_key) => {
            
            // Check if this is the clicked column
            var isClickedHeader = angular.equals( header, element );
            
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
    
    get( obj, property) {
        
        let value = _.get(obj, property);
        
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

export { SortableList }


