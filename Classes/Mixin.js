import 'lodash'
import { ClassHelper } from '../Helpers/ClassHelper'

class Mixin {
    
    /**
     *
     * @param Source
     * @returns {function(*=)}
     */
    static hardmixin( Source ){
        
        return Target => {
            
            // @TODO: trow also a transpiler error
            // Reject if instance is passed instead of class
            if( ! ClassHelper.isClass( Source ) ) {
                console.log('error');
                throw new Error('Parameter Source Must be a Class definition')
            }
            
            // Exclude constructor from mix
            let methodNames = _.pull( ClassHelper.getOwnMethodsNames( Source ), 'constructor' )
            
            // Mix Classes
            methodNames.forEach( e => { _.set( Target, e, _.get( Source.prototype, e) ) } )
    
            Mixin.addMixinProperties( Source, Target )
            
        }
        
    }
    
    /**
     *
     * @param Source
     * @returns {function(*=)}
     */
    static softmixin( Source ){
         
        return Target => {
            
            let methodNames = ClassHelper.getOwnMethodsNames( Source )
            methodNames.forEach( e =>  {
                if( !Target.hasOwnProperty(e) ) _.set( Target, e, _.get( Source.prototype, e) )
            })
    
            Mixin.addMixinProperties( Source, Target )
    
        }
        
    }
    
    static addMixinProperties( Source , Target ){
        
        // Get Source Class Name
        let className =  ClassHelper.getClassName(Source)
    
        // Add List of Mixed Class names
        if( ! Target.hasOwnProperty('_mixedWith') ) Target._mixedWith = [ className ];
        else Target._mixedWith.push( className )
    
        // Add metohd to check if a Class is mixed with a mixable
        if( ! Target.hasOwnProperty('_isMixedWith') )
            Target._isMixedWith = ( ClassToCheck ) => _.indexOf( Target._mixedWith , ClassHelper.getClassName(ClassToCheck) ) !== -1
        
    }
    
}

export { Mixin }
