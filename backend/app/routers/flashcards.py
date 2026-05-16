from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models.flashcard import Flashcard
from ..models.user import User
from ..schemas.flashcard import FlashcardCreate, FlashcardOut, FlashcardUpdate

router = APIRouter(prefix="/api/flashcards", tags=["flashcards"])


def _get_owned_card(card_id: int, user: User, db: Session) -> Flashcard:
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard not found")
    if card.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your flashcard")
    return card


@router.get("", response_model=list[FlashcardOut])
def list_flashcards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Flashcard)
        .filter(Flashcard.owner_id == current_user.id)
        .order_by(Flashcard.created_at.desc())
        .all()
    )


@router.post("", response_model=FlashcardOut, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    payload: FlashcardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = Flashcard(
        owner_id=current_user.id,
        deck=payload.deck,
        front=payload.front,
        back=payload.back,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.get("/{card_id}", response_model=FlashcardOut)
def get_flashcard(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _get_owned_card(card_id, current_user, db)


@router.put("/{card_id}", response_model=FlashcardOut)
def update_flashcard(
    card_id: int,
    payload: FlashcardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = _get_owned_card(card_id, current_user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card = _get_owned_card(card_id, current_user, db)
    db.delete(card)
    db.commit()
    return None
