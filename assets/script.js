onUpdate(() => {
    console.log('test')
    if (inputService.isKeyDown('ArrowRight')) {
        actor.position.x += 5
    }

})