import { ArrayHelper } from 'shared/helpers/array.helper';

describe('ArrayHelper', () => {

    it('copyArray should copy the array and not the reference', () => {
        // Given
        const arr1 = [1, 2, 3];

        // When
        const arr2 = ArrayHelper.copyArray(arr1);
        arr2.push(4);

        // Then
        expect(arr1).toEqual([1, 2, 3]);
        expect(arr2).toEqual([1, 2, 3, 4]);
    });

    it('shortByPropertyDesc sorts an array of object by provided property', () => {
        // Given
        const arr = [
            { a: 'b', id: 1 },
            { a: 'a', id: 2 },
            { a: 'c', id: 3 }
        ];

        // When
        arr.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'a'));

        // Then
        expect(arr[0]).toEqual({ a: 'c', id: 3 });
        expect(arr[1]).toEqual({ a: 'b', id: 1 });
        expect(arr[2]).toEqual({ a: 'a', id: 2 });
    });

    it('shortByPropertyAsc sorts an array of object by provided property', () => {
        // Given
        const arr = [
            { a: 'b', id: 1 },
            { a: 'a', id: 2 },
            { a: 'c', id: 3 }
        ];

        // When
        arr.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'a'));

        // Then
        expect(arr[0]).toEqual({ a: 'a', id: 2 });
        expect(arr[1]).toEqual({ a: 'b', id: 1 });
        expect(arr[2]).toEqual({ a: 'c', id: 3 });
    });
});
