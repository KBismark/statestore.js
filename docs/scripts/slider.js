function getClasses(direction,fade){
    fade=fade?{in:"fade-in",out:"fade-out"}:{in:"",out:""};
    switch (direction){
        case 2:
            return {
            visible:" slideright "+fade.in,
            invisible:" slideleft "+fade.out
            };
        case 4:
            return {
            visible:" slideleft "+fade.in,
            invisible:" slideright "+fade.out
            };
        default:
            return {
                visible:" slideup "+fade.in,
                invisible:" "+fade.out
            };
    }
};
    /**
     * @param {{direction:[],element:HTMLElement,fade:boolean}} option
     */
        function SlideIn(option){
        var classname=[],i,index=-1;
        option.Class=typeof (option.Class)==="string"?option.Class+" ":"";
        if(typeof (option.direction)==="number"){
        option.direction=[option.direction];
        }
        i=0;
        while(i<option.direction.length){
        classname.push(getClasses(option.direction[i],option.fade));
        i++;
        }
        option.ratios=typeof (option.ratioAll)==="number"?[option.ratioAll]:!option.ratios?[1]:option.ratios
        //console.log(option.element.previousElementSibling);
        if(IntersectionObserver){
            if(!option.targets){
                return new IntersectionObserver(function(res){
                
                    if (res[0].isIntersecting) {
                    
                        res[0].target.setAttribute("class",option.Class+classname[0].visible);
                    }
                    else {
                    res[0].target.setAttribute("class",option.Class+classname[0].invisible);
                    }
                }, {
                    rootElement:null,
                        threshold : 0
                    // rootMargin : "0px"
                }).observe(option.element)
            }else{
                return new IntersectionObserver(function(res){
                i=0;
                    if (res[0].isIntersecting){
                    while(i<option.targets.length){
                        option.targets[i].element.setAttribute("class",option.targets[i].Class+classname[i].visible);
                        i++;
                    }
                    }
                    else {
                    while(i<option.targets.length){
                        option.targets[i].element.setAttribute("class",option.targets[i].Class+classname[i].invisible);
                        i++;
                    }
                    }
                }, {
                    rootElement:null,
                        threshold : option.ratios
                    // rootMargin : "0px"
                }).observe(option.element)
            }
        }else{
            //No animation -- Browser not supported
            if(!option.targets){
                option.element.setAttribute("class",option.Class+classname[0].visible);
            }else{
            i=0;
            while(i<option.targets.length){
                option.targets[i].element.setAttribute("class",option.targets[i].Class+classname[i].visible);
                i++;
            }
            }
            return null;
        }
    };