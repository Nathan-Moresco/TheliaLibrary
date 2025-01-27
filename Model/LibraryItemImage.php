<?php

namespace TheliaLibrary\Model;

use Propel\Runtime\Connection\ConnectionInterface;
use Thelia\Model\Tools\PositionManagementTrait;
use TheliaLibrary\Model\Base\LibraryItemImage as BaseLibraryItemImage;

/**
 * Skeleton subclass for representing a row from the 'library_item_image' table.
 *
 *
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 */
class LibraryItemImage extends BaseLibraryItemImage
{
    use PositionManagementTrait;

    /**
     * Calculate next position relative to our product.
     */
    protected function addCriteriaToPositionQuery($query): void
    {
        /** @var $query LibraryItemImageQuery */
        $query->filterByItemId($this->getItemId())
            ->filterByItemType($this->getItemType());
    }

    /**
     * {@inheritDoc}
     */
    public function preInsert(ConnectionInterface $con = null)
    {
        $this->setPosition($this->getNextPosition());

        parent::preInsert($con);

        return true;
    }

    public function preDelete(ConnectionInterface $con = null)
    {
        parent::preDelete($con);

        $this->reorderBeforeDelete(
            [
                'item_id' => $this->getItemId(),
                'item_type' => $this->getItemType()
            ]
        );

        return true;
    }
}
